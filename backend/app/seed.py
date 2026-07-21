from sqlalchemy import text

from app.database import Base, SessionLocal, engine
from app.models import Task, User
from app.security import hash_password

DEMO_USERS = [
    {"name": "Demo User", "email": "demo@example.com", "password": "password123"},
    {"name": "Tristanto Wijaya", "email": "tristanto@example.com", "password": "password123"},
    {"name": "Calvin Setiawan", "email": "calvin@example.com", "password": "password123"},
    {"name": "Wellson Charlest", "email": "wellson@example.com", "password": "password123"},
    {"name": "Chelsea Willis", "email": "chelsea@example.com", "password": "password123"},
    {"name": "Olivia Joanna", "email": "olivia@example.com", "password": "password123"},
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # TRUNCATE (rather than DELETE) also resets the identity sequences,
        # so IDs start from 1 again on every run.
        db.execute(text(f"TRUNCATE TABLE {Task.__tablename__}, {User.__tablename__} RESTART IDENTITY CASCADE"))
        db.commit()

        users = [
            User(name=u["name"], email=u["email"], hashed_password=hash_password(u["password"]))
            for u in DEMO_USERS
        ]
        db.add_all(users)
        db.commit()

        print(f"Seeded {len(users)} users. Tasks table is empty.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
