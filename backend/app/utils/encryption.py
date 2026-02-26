from cryptography.fernet import Fernet
from app.config import get_settings


def get_fernet() -> Fernet:
    settings = get_settings()
    if not settings.encryption_key:
        # Generate a key for development if not set
        key = Fernet.generate_key()
        return Fernet(key)
    return Fernet(settings.encryption_key.encode() if isinstance(settings.encryption_key, str) else settings.encryption_key)


def encrypt(value: str) -> str:
    """Encrypt a string value."""
    if not value:
        return value
    f = get_fernet()
    return f.encrypt(value.encode()).decode()


def decrypt(value: str) -> str:
    """Decrypt an encrypted string value."""
    if not value:
        return value
    f = get_fernet()
    return f.decrypt(value.encode()).decode()
