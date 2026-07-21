from sqlalchemy.orm import Session

from app.models import User


def get_users(db: Session) -> list[User]:
    return db.query(User).order_by(User.name).all()
