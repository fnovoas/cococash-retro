import os
import sqlite3
from pathlib import Path

DB_PATH = os.getenv("DATABASE_PATH", "/data/auth.db")
SCHEMA_PATH = os.getenv("SCHEMA_PATH", "/db/schema.sql")


def get_connection() -> sqlite3.Connection:
    db_file = Path(DB_PATH)
    db_file.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_file)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    schema_file = Path(SCHEMA_PATH)
    if not schema_file.is_file():
        raise FileNotFoundError(f"Schema not found: {schema_file}")

    schema_sql = schema_file.read_text(encoding="utf-8")
    with get_connection() as conn:
        conn.executescript(schema_sql)
        conn.commit()
