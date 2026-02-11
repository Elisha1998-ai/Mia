
import os
from dotenv import load_dotenv
from database import SessionLocal, init_db
from business_data import get_business_summary
from agents import run_agent_task

load_dotenv()

def test_db():
    print("Testing Database Connection...")
    try:
        db = SessionLocal()
        summary = get_business_summary(db)
        print("Business Summary Result:")
        print(summary)
        db.close()
        return True
    except Exception as e:
        print(f"DB ERROR: {e}")
        return False

def test_ai():
    print("\nTesting AI (Groq) Connection...")
    # Use the key from terminal 5 environment if possible, or from .env
    api_key = os.getenv("GROQ_API_KEY")
    print(f"Using API Key: {api_key[:10]}...{api_key[-5:] if api_key else 'None'}")
    
    try:
        result = run_agent_task(
            "Test Agent", 
            "Respond with 'Success'", 
            "A test assistant", 
            "Say 'Success' if you can read this."
        )
        print(f"AI Result: {result}")
        return "Success" in result
    except Exception as e:
        print(f"AI ERROR: {e}")
        return False

if __name__ == "__main__":
    db_ok = test_db()
    ai_ok = test_ai()
    
    print("\n--- TEST SUMMARY ---")
    print(f"Database: {'OK' if db_ok else 'FAILED'}")
    print(f"AI (Groq): {'OK' if ai_ok else 'FAILED'}")
