from pydantic import BaseModel

class Product(BaseModel):
    name: str
    price: float

class ProductInDB(Product):
    id: int