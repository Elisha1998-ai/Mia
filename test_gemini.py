import google.generativeai as genai
import os

# Check if API key is set
api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    print("❌ GOOGLE_API_KEY environment variable not set")
    print("Please set your Google AI API key:")
    print("set GOOGLE_API_KEY=your_api_key_here")
else:
    print("✅ API key found!")
    try:
        genai.configure(api_key=api_key)
        print("✅ Gemini configured successfully!")
        # Test basic functionality
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content("Say hello in one word")
        print(f"✅ Test response: {response.text.strip()}")
    except Exception as e:
        print(f"❌ Error: {e}")