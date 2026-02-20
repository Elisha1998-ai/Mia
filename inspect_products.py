
from database import get_db
from models import Product, User

def inspect_products():
    db = next(get_db())
    try:
        products = db.query(Product).all()
        print(f"Total products found: {len(products)}")
        for p in products:
            print(f"Product: {p.name}, UserID: {p.user_id}, ID: {p.id}")
            
        users = db.query(User).all()
        print(f"\nTotal users found: {len(users)}")
        for u in users:
            print(f"User: {u.email}, ID: {u.id}")
            
    finally:
        db.close()

if __name__ == "__main__":
    inspect_products()
