from reportlab.pdfgen import canvas
from io import BytesIO

def create_invoice_pdf(order_data: dict):
    """
    Generates a PDF invoice in memory.
    """
    buffer = BytesIO()
    p = canvas.Canvas(buffer)
    
    p.drawString(100, 800, f"INVOICE FOR: {order_data.get('customer_name', 'Customer')}")
    p.drawString(100, 780, f"Order ID: {order_data.get('order_id', 'N/A')}")
    p.drawString(100, 760, "-----------------------------------")
    
    y = 740
    for item in order_data.get('items', []):
        p.drawString(100, y, f"{item.get('name', 'Item')} - ${item.get('price', 0)}")
        y -= 20
        
    p.drawString(100, y-20, f"Total: ${order_data.get('total', 0)}")
    p.showPage()
    p.save()
    
    buffer.seek(0)
    return buffer
