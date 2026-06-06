import re

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def validate_email_format(email: str) -> str:
    normalized = email.strip()
    if not EMAIL_PATTERN.match(normalized):
        raise ValueError("INVALID_EMAIL")
    return normalized
