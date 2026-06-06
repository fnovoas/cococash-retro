from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from app.models import UserRegister, UserLogin
from app.auth import hash_password, verify_password, create_token, SECRET_KEY, ALGORITHM
from app.database import init_db
from app.users import create_user, get_user_by_email

security = HTTPBearer()


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "ok"}


def build_token(email: str, name: str, wallet_id: str) -> str:
    return create_token(
        {
            "sub": email,
            "email": email,
            "name": name,
            "wallet_id": wallet_id,
        }
    )


@app.post("/register")
def register(user: UserRegister):
    if get_user_by_email(user.email):
        raise HTTPException(status_code=409, detail="User already exists")

    wallet_id = create_user(user.email, user.name, hash_password(user.password))
    token = build_token(user.email, user.name, wallet_id)

    return {
        "message": "User registered",
        "token": token,
        "wallet_id": wallet_id,
    }


@app.post("/login")
def login(user: UserLogin):
    db_user = get_user_by_email(user.email)

    if not db_user:
        raise HTTPException(status_code=404, detail="USER_NOT_FOUND")

    if not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="INVALID_CREDENTIALS")

    token = build_token(db_user["email"], db_user["name"], db_user["wallet_id"])
    return {"token": token, "wallet_id": db_user["wallet_id"]}


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/me")
def me(user=Depends(get_current_user)):
    return user
