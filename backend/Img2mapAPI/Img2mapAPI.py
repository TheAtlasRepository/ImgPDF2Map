from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from Routers import georeferencing ,converters

app = FastAPI()
router = APIRouter()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#todo: add routes to router
# Default test route
@router.get("/")
async def root():
    #redirect to the documentation
    return {"message": "Welcome to the georeferencing API. Please refer to the documentation for more information. at /docs or /redoc"}

#adding the routers to the app

#Converter routes
app.router.include_router(converters.router, prefix="/converter", tags=["converter"])

#Goereferencing routes
app.router.include_router(georeferencing.router)
