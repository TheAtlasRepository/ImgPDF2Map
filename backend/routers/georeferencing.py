from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from modules.georeferenser import add_gcp
from modules.models import Point
#Router handles all requests to the georeferencing API
router = APIRouter()

#path: eks http://localhost:8000/georef
@router.get("/", tags=["georeferencing"])
async def root():
    return {"message": "Hello World"}

#route for georeferncing the gtiff uses the add_gcp function from georeferencer.py
#function parameters: image: bytes, points: list[Point]
@router.post("/", tags=["georeferencing"])
async def georeference(file: UploadFile = File(...), points: list[Point] = Form(...)):
    #check if file is a geotiff
    if file.content_type != "image/tiff":
        raise HTTPException(status_code=400, detail="File is not a geotiff")
    #check if points is a list
    if not isinstance(points, list):
        raise HTTPException(status_code=400, detail="Points is not a list")
    #check if points is a list of Point models
    if not all(isinstance(point, Point) for point in points):
        raise HTTPException(status_code=400, detail="Points is not a list of Point models")
    #add gcp to image
    gdf = add_gcp(file.file, points)
    #check if gdf is None
    if gdf is None:
        raise HTTPException(status_code=400, detail="Not enough points")
    #return as gtiff file
    return gdf.to_file("georeferenced.tif", driver="GTiff")

#path: eks http://localhost:8000/georef/1
@router.get("/{id}", tags=["georeferencing"])
async def get_point(id: int):
    return {"message": "Hello World"}
