
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
database_url = os.getenv("DATABASE_URL")
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(database_url)

def check_columns():
    with engine.connect() as conn:
        print("Checking columns for 'user' table...")
        result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'user'"))
        columns = [row[0] for row in result]
        print(f"Columns in 'user': {columns}")
        
        # Check other tables too
        tables = ['product', 'customer', 'order', 'store']
        for table in tables:
            result = conn.execute(text(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table}'"))
            columns = [row[0] for row in result]
            print(f"Columns in '{table}': {columns}")

if __name__ == "__main__":
    check_columns()
