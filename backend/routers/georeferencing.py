from fastapi import APIRouter

#Router handles all requests to the georeferencing API
router = APIRouter()

#path: eks http://localhost:8000/georef
@router.get("/", tags=["georeferencing"])
async def root():
    return {"message": "Hello World"}


#path: eks http://localhost:8000/georef/1
@router.get("/{id}", tags=["georeferencing"])
async def get_point(id: int):
    return {"message": "Hello World"}