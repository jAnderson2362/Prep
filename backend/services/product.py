from core.database import supabase
from models.product import Product

def create_product(product: Product):
    return supabase.table("products").insert(product.model_dump()).execute()

def get_all_products():
    return supabase.table("products").select("*").execute()

def get_product(product_id: int):
    return supabase.table("products").select("*").eq("id", product_id).execute()

def update_product(product_id: int, product: Product):
    return supabase.table("products").update(product.model_dump()).eq("id", product_id).execute()

def delete_product(product_id: int):
    return supabase.table("products").delete().eq("id", product_id).execute()