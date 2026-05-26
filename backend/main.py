from fastapi import FastAPI
from dotenv import load_dotenv
from pydantic import BaseModel
from supabase import create_client, Client
import os

load_dotenv()  # reads .env into environment

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

app = FastAPI()


# Create the Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Pydantic model for data validation
class Product(BaseModel):
    name: str
    price: float

class ProductInDB(Product):
    id: int

# --- API Endpoints ---

@app.post("/products", response_model=ProductInDB)
def create_product(product: Product):
    """Create a new product."""
    data = product.dict()
    response = supabase.table("products").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create product")
    return response.data[0]

@app.get("/products", response_model=list[ProductInDB])
def get_all_products():
    response = supabase.table("products").select("*").execute()
    print(response)
    return response.data

@app.get("/products/{product_id}", response_model=ProductInDB)
def get_product(product_id: int):
    """Get a product by ID."""
    response = supabase.table("products").select("*").eq("id", product_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return response.data[0]

@app.put("/products/{product_id}", response_model=ProductInDB)
def update_product(product_id: int, product: Product):
    """Update an existing product."""
    data = product.dict()
    response = supabase.table("products").update(data).eq("id", product_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return response.data[0]

@app.delete("/products/{product_id]")
def delete_product(product_id: int):
    """Delete a product."""
    response = supabase.table("products").delete().eq("id", product_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": f"Product with ID {product_id} deleted"}