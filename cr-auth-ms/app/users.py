import uuid
from typing import Any

from app.database import get_connection


def get_user_by_email(email: str) -> dict[str, Any] | None:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT email, name, password_hash, wallet_id FROM users WHERE email = ?",
            (email,),
        ).fetchone()
        return dict(row) if row else None


def create_user(email: str, name: str, password_hash: str) -> str:
    wallet_id = str(uuid.uuid4())
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO users (email, name, password_hash, wallet_id)
            VALUES (?, ?, ?, ?)
            """,
            (email, name, password_hash, wallet_id),
        )
        conn.commit()
    return wallet_id
