from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import products
from routers import exam_system
from routers import level
from routers import standard
from routers import topic

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(exam_system.router)
app.include_router(level.router)
app.include_router(standard.router)
app.include_router(topic.router)