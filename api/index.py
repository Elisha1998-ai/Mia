import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

# Configure root path for Vercel deployment so that /chat-api prefix is stripped
app.root_path = "/chat-api"
