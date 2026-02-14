import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv('DATABASE_URL')
print(f"Connecting to: {db_url}")
engine = create_engine(db_url)

with engine.connect() as conn:
    try:
        # Check tables
        tables = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")).fetchall()
        print(f"Tables in DB: {[t[0] for t in tables]}")
        
        # Check product count
        count = conn.execute(text('SELECT count(*) FROM product')).scalar()
        print(f"Total products: {count}")
        
        if count > 0:
            results = conn.execute(text('SELECT id, name, "userId" FROM product LIMIT 5')).fetchall()
            for row in results:
                print(f"Product: {row}")
            
        users = conn.execute(text('SELECT id, email FROM "user" LIMIT 5')).fetchall()
        print(f"Users: {users}")
    except Exception as e:
        print(f"Error: {e}")
