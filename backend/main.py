from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from models.response import APIResponse
from routers import products, authentication, exam_system, level, standard, topic, ai, results, progress
from core import settings
from starlette.exceptions import HTTPException as StarletteHTTPException
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from core.limiter import limiter
from routers import progress


app = FastAPI()

# Rate limitng
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security headers
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    if "server" in response.headers:
        del response.headers["server"]
    return response

# HTTPS redirect in production only
if settings.environment == "production":
    from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
    app.add_middleware(HTTPSRedirectMiddleware)

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

@app.exception_handler(RateLimitExceeded)
def handle_rate_limit(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content=APIResponse(error="Too many requests. Please try again later.", status=429).model_dump()
    )

app.include_router(products.router)
app.include_router(authentication.router)
app.include_router(exam_system.router)
app.include_router(level.router)
app.include_router(standard.router)
app.include_router(topic.router)
app.include_router(ai.router)
app.include_router(results.router)
app.include_router(progress.router)
