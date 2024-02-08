import rasterio as rio
from rasterio.enums import Resampling
from rasterio.plot import show
import numpy as np
import tempfile

#imports of self-written models
from .models import Point

#parameters: tempFilePath, points: list[Point], crs: str
#returns: georeferenced image of type gtiff
def georeferencer(tempFilePath, points):

    #check if the points are valid
    if len(points) < 3:
        raise Exception("At least 3 points are needed to georeference an image")
    for point in points:
        if not isinstance(point, Point):
            raise Exception("Invalid point")

    
    def createTransformationMatrix(points, crs):
        #create the transformation matrix
        #get the coordinates of the points
        coords = [(point.longitude, point.latitude) for point in points]
        #get the pixel coordinates of the points
        pixels = [(point.x, point.y) for point in points]
        #create the transformation matrix
        transform, width, height = rio.transform.from_origin(
            coords[0][0], coords[0][1], pixels[0][0], pixels[0][1]
        )
        return transform, width, height

    #open the image in read using rasterio gdaldriver="PNG"
    with rio.open(tempFilePath, "r", driver="PNG") as src:
        #create a new temporary file for the georeferenced image
        with tempfile.NamedTemporaryFile(suffix=".tif") as dst:
            #create the transformation matrix
            transform, width, height = createTransformationMatrix(points, "EPSG:4326")
            #create the new image
            dst.write(src.read(
                out_shape=(src.count, height, width),
                resampling=Resampling.bilinear,
                transform=transform
            ))
            #return the path of the georeferenced image
            return dst.name