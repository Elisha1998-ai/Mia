import urllib.parse

def generate_marketing_asset(prompt: str, asset_type: str = "logo"):
    """
    Generates an image for free using Pollinations.ai
    asset_type: 'logo' or 'flier'
    """
    # Refine the prompt based on the asset type
    refined_prompt = f"{asset_type} for {prompt}, professional, high quality, ecommerce style"
    encoded_prompt = urllib.parse.quote(refined_prompt)
    
    image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true"
    
    return {
        "type": asset_type,
        "url": image_url,
        "prompt_used": refined_prompt
    }
