
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

print(f"API Key found: {api_key[:10]}...")

try:
    llm = ChatGroq(
        temperature=0.7,
        model_name="llama-3.3-70b-versatile",
        groq_api_key=api_key
    )
    messages = [
        SystemMessage(content="You are a helpful assistant."),
        HumanMessage(content="Hi")
    ]
    print("Invoking LLM...")
    response = llm.invoke(messages)
    print("Response received:")
    print(response.content)
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
