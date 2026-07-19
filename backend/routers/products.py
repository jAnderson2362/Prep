from fastapi import APIRouter, HTTPException, Request
from models.product import Product, ProductInDB
import services.product as service
from core.limiter import limiter
from core import settings

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=list[ProductInDB])
@limiter.limit(settings.rate_limit_default)
def get_all(request: Request):
    response = service.get_all_products()
    return response.data

@router.get("/{product_id}", response_model=ProductInDB)
@limiter.limit(settings.rate_limit_default)
def get_one(request: Request, product_id: int):
    response = service.get_product(product_id)
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return response.data[0]

@router.post("/", response_model=ProductInDB)
@limiter.limit(settings.rate_limit_default)
def create(request: Request, product: Product):
    response = service.create_product(product)
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create product")
    return response.data[0]

@router.put("/{product_id}", response_model=ProductInDB)
@limiter.limit(settings.rate_limit_default)
def update(request: Request, product_id: int, product: Product):
    response = service.update_product(product_id, product)
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return response.data[0]

@router.delete("/{product_id}")
@limiter.limit(settings.rate_limit_default)
def delete(request: Request, product_id: int):
    check = service.get_product(product_id)
    if not check.data:
        raise HTTPException(status_code=404, detail="Product not found")
    service.delete_product(product_id)
    return {"message": f"Product {product_id} deleted"}