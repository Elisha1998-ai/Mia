import streamlit as st
import requests
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(page_title="Mia AI Agent", page_icon="🤖", layout="wide")

st.title("🤖 Mia: The Ecommerce AI Engine")

# Sidebar for API Keys
with st.sidebar:
    st.title("Settings")
    groq_key = st.text_input("Groq API Key", type="password", value=os.getenv("GROQ_API_KEY", ""))
    if groq_key:
        if st.button("Update Key"):
            try:
                requests.post(f"{API_URL}/mia/settings", json={"GROQ_API_KEY": groq_key})
                st.success("Key updated in Mia's brain!")
            except Exception as e:
                st.error(f"Failed to update key: {e}")
    st.divider()
    st.title("Mia's Modules")

module = st.sidebar.selectbox("Choose a Module", ["Dashboard", "Branding", "Finance", "Data Ingestion"])

# API URL (assuming FastAPI runs on 8000)
API_URL = "http://localhost:8000"

if module == "Dashboard":
    st.header("Mia's System Status")
    col1, col2, col3 = st.columns(3)
    col1.metric("Orders Processed", "124", "+12%")
    col2.metric("Logos Generated", "45", "Live")
    col3.metric("Revenue Tracked", "$12,400", "+5%")
    
    st.divider()
    st.write("### Welcome to Mia")
    st.info("Mia is your multi-functional AI agent designed to handle branding, accounting, and data architecture for ecommerce businesses.")

elif module == "Branding":
    st.header("🎨 Creative Studio")
    business_name = st.text_input("Client Business Name", placeholder="e.g. EcoGlow")
    niche = st.text_input("Niche", placeholder="e.g. Sustainable Skincare")
    
    if st.button("Generate Brand Assets"):
        if not business_name or not niche:
            st.warning("Please provide both business name and niche.")
        else:
            with st.spinner("Mia is designing..."):
                try:
                    response = requests.post(
                        f"{API_URL}/mia/generate-brand",
                        params={"business_name": business_name, "niche": niche}
                    )
                    if response.status_code == 200:
                        data = response.json()
                        st.subheader(f"Brand Identity for {data['brand']}")
                        st.write(f"**Mia's Vision:** {data['description']}")
                        
                        assets = data["assets"]
                        cols = st.columns(len(assets))
                        for i, asset in enumerate(assets):
                            cols[i].image(asset["url"], caption=asset["type"])
                    else:
                        st.error("Mia's creative brain is busy. Try again!")
                except Exception as e:
                    st.error(f"Error connecting to Mia's backend: {e}")

elif module == "Data Ingestion":
    st.header("📊 Data Architect")
    st.write("Upload a messy CSV and watch Mia map it to your database schema.")
    uploaded_file = st.file_uploader("Upload Client CSV", type="csv")
    if uploaded_file:
        df = pd.read_csv(uploaded_file)
        st.write("Preview:", df.head())
        if st.button("Mia, Analyze Data"):
            with st.spinner("Mia is mapping columns to the Database..."):
                try:
                    files = {"file": uploaded_file.getvalue()}
                    response = requests.post(f"{API_URL}/ingest-products/", files=files)
                    if response.status_code == 200:
                        st.success("Analysis Complete!")
                        st.write("### Mapping Recommendations")
                        st.write(response.json()["mapping"])
                    else:
                        st.error("Mia failed to analyze the data.")
                except Exception as e:
                    st.error(f"Error connecting to Mia's backend: {e}")

elif module == "Finance":
    st.header("💰 Finance Hub")
    st.write("Mia generates invoices and tracks profit margins.")
    
    with st.expander("Create Sample Invoice"):
        cust_name = st.text_input("Customer Name")
        item_name = st.text_input("Item Name")
        price = st.number_input("Price", min_value=0.0)
        
        if st.button("Generate PDF"):
            # This would ideally call the backend
            st.info("Finance module logic is ready in the backend. PDF generation is available via the finance.py module.")
