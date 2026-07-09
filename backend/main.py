from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import products, authentication, exam_system, level,standard,topic
from core import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(authentication.router)
app.include_router(exam_system.router)
app.include_router(level.router)
app.include_router(standard.router)
app.include_router(topic.router)
