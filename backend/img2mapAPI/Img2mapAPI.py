from fastapi import FastAPI, APIRouter, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from img2mapAPI.routers import *


app = FastAPI(
    title="Img2Map API",
    description="API for converting and georeferencing images",
)

router = APIRouter()

origins = [
    "http://localhost", #for local testing
    "http://localhost:8080", # for vue dev server
    "http://localhost:3000", # for react dev server
    "https://img2map-f5cee540ffb0.herokuapp.com/" # for the deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Default route
@router.get("/")
async def root():
    return {"message": "Welcome to the georeferencing API. Please refer to the documentation for more information. at /docs or /redoc"}

#adding the routers to the app
app.router.include_router(converters.router, prefix="/converter", tags=["converter"])
app.router.include_router(georefProject.router)
