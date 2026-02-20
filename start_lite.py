
import sys
import os
from unittest.mock import MagicMock

# --- Mocking heavy/missing dependencies ---

# Mock pandas
mock_pandas = MagicMock()
mock_pandas.DataFrame = MagicMock
mock_pandas.read_csv = MagicMock
sys.modules["pandas"] = mock_pandas

# Mock numpy
sys.modules["numpy"] = MagicMock()

# Mock langchain and crewai
sys.modules["langchain"] = MagicMock()
sys.modules["langchain_groq"] = MagicMock()
sys.modules["langchain_core"] = MagicMock()
sys.modules["crewai"] = MagicMock()

# Mock reportlab
sys.modules["reportlab"] = MagicMock()

# --- Mocking application modules that depend on heavy libs ---

# Mock agents
mock_agents = MagicMock()
# Configure return values for specific agent tasks to avoid serialization errors
mock_agents.copywriter_task.return_value = "This is a dummy description (AI agent not available in lite mode)."
sys.modules["agents"] = mock_agents

# Mock modules
mock_creative = MagicMock()
sys.modules["modules.creative"] = mock_creative

mock_finance = MagicMock()
# create_invoice_pdf likely returns a file-like object or path? 
# Checking main.py: from modules.finance import create_invoice_pdf
sys.modules["modules.finance"] = mock_finance

# Mock connectors
mock_shopify = MagicMock()
sys.modules["connectors.shopify"] = mock_shopify

# Mock business_data
mock_business_data = MagicMock()
mock_business_data.get_business_summary.return_value = {
    "revenue": 0,
    "orders": 0,
    "customers": 0,
    "products": 0
}
sys.modules["business_data"] = mock_business_data

# --- Import main app ---
try:
    from main import app
    import uvicorn
    
    # Override startup event if needed, but main.py's startup calls init_db which should work with sqlite
    
    print("🚀 Starting Mia Backend Server (LITE MODE)...")
    print("⚠️  AI features and heavy processing are disabled.")
    print("📍 Host: 0.0.0.0:8000")
    
    if __name__ == "__main__":
        uvicorn.run(app, host="0.0.0.0", port=8000)
        
except ImportError as e:
    print(f"❌ Failed to start lite server: {e}")
    # Print what failed to import
    import traceback
    traceback.print_exc()
