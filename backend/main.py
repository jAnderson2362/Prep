from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from models.response import APIResponse
from routers import products, authentication, exam_system, level,standard,topic
from core import settings
from starlette.exceptions import HTTPException as StarletteHTTPException


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(HTTPException)
def handle_http_exception(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=APIResponse(error=exc.detail, status=exc.status_code).model_dump()
    )

@app.exception_handler(RequestValidationError)
def handle_validation_error(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content=APIResponse(error=str(exc.errors()), status=422).model_dump()
    )

@app.exception_handler(Exception)
def handle_general_exception(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=APIResponse(error="Internal server error", status=500).model_dump()
    )

@app.exception_handler(StarletteHTTPException)
def handle_starlette_exception(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=APIResponse(error=exc.detail, status=exc.status_code).model_dump()
    )

app.include_router(products.router)
app.include_router(authentication.router)
app.include_router(exam_system.router)
app.include_router(level.router)
app.include_router(standard.router)
app.include_router(topic.router)
