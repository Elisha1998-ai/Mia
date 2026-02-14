
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
database_url = os.getenv("DATABASE_URL")
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(database_url)

def test_query():
    with engine.connect() as conn:
        print("Testing exact query...")
        try:
            # Note the double quotes for identifiers because 'user' is reserved and columns are camelCase
            query = text('SELECT "id", "name", "firstName", "lastName", "email", "emailVerified", "image", "createdAt", "updatedAt" FROM "user" WHERE "email" = :email LIMIT 1')
            result = conn.execute(query, {"email": "elishaolayonwae@gmail.com"})
            row = result.fetchone()
            print(f"Result: {row}")
        except Exception as e:
            print(f"Query failed: {e}")

if __name__ == "__main__":
    test_query()
