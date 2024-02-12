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
    # check if points contain at least 3 point models

    #first convert png to tiff
    tiffFile = png2geotiff(tempFilePath)

    # create gcps from points latitude
    gcps = []
    for point in points:
        gcps.append(rio.control.GroundControlPoint(point.x, point.y, point.longitude, point.latitude))

    # create the georeferencing transform
    transform = rio.transform.from_origin(gcps[0].lon, gcps[0].lat, gcps[1].x - gcps[0].x, gcps[2].y - gcps[0].y)

    # update the transform in the tiff file
    with rio.open(tiffFile, "r+") as tiff:
        tiff.transform = transform

    # return transformed tiff
    return tiffFile
        

#function to convert png to Tiff
def png2geotiff(tempFilePath):
    dataset = rio.open(tempFilePath)
    bands = [1, 2, 3] # I assume that you have only 3 band i.e. no alpha channel in your PNG
    data = dataset.read(bands)

    # create the output transform
    west, south, east, north = (-180, -90, 180, 90)
    transform = rio.transform.from_bounds(
        west, 
        south, 
        east, 
        north, 
        data.shape[1], 
        data.shape[2]
    )

    # set the output image kwargs
    kwargs = {
        "driver": "GTiff",
        "width": data.shape[1], 
        "height": data.shape[2],
        "count": len(bands), 
        "dtype": data.dtype, 
        "nodata": 0,
        "transform": transform, 
        "crs": "EPSG:4326"
    }

    #creating tempfile
    temp_file = tempfile.NamedTemporaryFile(suffix='.tif').name

    with rio.open(temp_file, "w", **kwargs) as dst:
        dst.write(data, indexes=bands)
    
    #returning the new written file
    return temp_file

