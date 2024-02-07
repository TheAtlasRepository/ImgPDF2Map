from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from routers import georeferencing ,converters

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
    return {"message": "Hello World"}

#adding the routers to the app

#Converter routes
app.router.include_router(converters.router, prefix="/converter", tags=["converter"])

#Goereferencing routes
app.router.include_router(georeferencing.router, prefix="/project", tags=["georeferencing"])

# if __name__ == "__main__": run unicorn server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
