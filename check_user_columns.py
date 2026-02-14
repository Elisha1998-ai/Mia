
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
database_url = os.getenv("DATABASE_URL")
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(database_url)

def check_user_table():
    with engine.connect() as conn:
        print("Detailed check for 'user' table columns...")
        # Use a query that shows column case clearly
        result = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user'"))
        for row in result:
            print(f"Column: '{row[0]}', Type: {row[1]}")

if __name__ == "__main__":
    check_user_table()
