#!/usr/bin/env python3
"""
Robust backend server startup script with proper error handling
and database connection management.
"""

import os
import sys
import time
from pathlib import Path

def check_database_connection():
    """Check if database is accessible"""
    try:
        from database import init_db
        init_db()
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def start_server():
    """Start the FastAPI server with proper configuration"""
    try:
        import uvicorn
        from main import app
        
        print("🚀 Starting Mia Backend Server...")
        print("📍 Host: 0.0.0.0:8000")
        print("🔄 Auto-reload enabled")
        print("=" * 50)
        
        # Start server with proper configuration
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            reload_dirs=["."],
            log_level="info"
        )
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Change to project directory
    project_dir = Path(__file__).parent
    os.chdir(project_dir)
    
    # Load environment
    from dotenv import load_dotenv
    load_dotenv()
    
    # Check database connection
    if not check_database_connection():
        print("⚠️  Retrying database connection in 5 seconds...")
        time.sleep(5)
        if not check_database_connection():
            print("❌ Cannot establish database connection. Please check your DATABASE_URL in .env")
            sys.exit(1)
    
    # Start server
    start_server()