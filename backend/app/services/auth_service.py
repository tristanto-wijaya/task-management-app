from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import User
from app.security import create_access_token, verify_password


def login(db: Session, email: str, password: str) -> str:
    user = db.query(User).filter(User.email == email).first()
    if user is None or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return create_access_token(subject=user.email)
