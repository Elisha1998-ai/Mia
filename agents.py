from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import SystemMessage, HumanMessage
import os
from dotenv import load_dotenv

# Initialize the LLM (using Groq for speed and $0 cost)
def get_llm():
    """
    Securely loads the LLM using environment variables.
    """
    project_root = os.path.dirname(os.path.abspath(__file__))
    dotenv_path = os.path.join(project_root, '.env')
    load_dotenv(dotenv_path=dotenv_path, override=True)
    
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not found in .env file")

    return ChatOpenAI(
        openai_api_base="https://api.groq.com/openai/v1",
        openai_api_key=api_key,
        model_name="llama-3.1-8b-instant"
    )

def run_agent_task(persona_name, persona_goal, persona_backstory, task_description):
    """
    Simulates a CrewAI agent using LangChain
    """
    llm = get_llm()
    messages = [
        SystemMessage(content=f"You are a {persona_name}. Your goal is {persona_goal}. Your background: {persona_backstory}"),
        HumanMessage(content=task_description)
    ]
    
    response = llm.invoke(messages)
    return response.content

# Persona definitions (as functions or data objects)
def data_architect_task(task_description):
    return run_agent_task(
        "Data Architect",
        "Clean and map CSV data to the ecommerce database schema",
        "Expert in data engineering and SQL. You ensure all product data is valid.",
        task_description
    )

def brand_designer_task(task_description):
    return run_agent_task(
        "Brand Designer",
        "Create compelling product descriptions and branding assets",
        "A creative genius who knows how to make products sell using emotional triggers.",
        task_description
    )

def accountant_task(task_description):
    return run_agent_task(
        "Accountant",
        "Generate invoices and track profit margins",
        "Detail-oriented financial expert who manages the store balance sheet.",
        task_description
    )

def copywriter_task(task_description):
    return run_agent_task(
        "Copywriter",
        "Write persuasive and brand-aligned storefront copy",
        "A marketing wordsmith who knows how to capture a brand's voice and convert visitors into buyers.",
        task_description
    )

def support_agent_task(task_description):
    return run_agent_task(
        "Mia (Support Agent)",
        "Greet users warmly and provide concise help",
        "A friendly and helpful AI assistant named Mia. You keep your responses brief, professional, and empathetic. Never provide long technical lists unless explicitly asked.",
        task_description
    )

def general_advisor_task(task_description):
    return run_agent_task(
        "Mia (Ecommerce Advisor)",
        "Provide expert ecommerce advice and growth strategies",
        "A knowledgeable ecommerce consultant who gives actionable, concise advice. You focus on helping the user grow their business without being overly wordy.",
        task_description
    )

def marketing_agent_task(task_description):
    return run_agent_task(
        "Marketing Agent",
        "Create email marketing campaigns, sales funnels, and upsell logic",
        "A high-energy growth hacker who focuses on increasing customer lifetime value (LTV).",
        task_description
    )

def intent_classifier_task(user_input):
    return run_agent_task(
        "Intent Classifier",
        "Determine the user's intent from their message",
        "An expert in linguistics and user experience. You categorize messages into one of these: 'greeting', 'brand_generation', 'store_setup', 'product_extraction', 'insight_request', or 'general_query'. Return ONLY the category name.",
        user_input
    )

def parameter_extractor_task(user_input):
    return run_agent_task(
        "Parameter Extractor",
        "Extract business name and niche from the message",
        "An expert at identifying entities. Return ONLY a JSON object with 'business_name' and 'niche'. If not found, use 'Unknown'. Example: {'business_name': 'Lumos', 'niche': 'skincare'}",
        user_input
    )

def logistics_agent_task(task_description):
    return run_agent_task(
        "Logistics Agent",
        "Track shipments and coordinate with carriers",
        "A reliable coordinator who ensures products reach customers on time.",
        task_description
    )
