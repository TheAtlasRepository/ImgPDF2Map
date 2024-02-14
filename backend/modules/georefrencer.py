import rasterio as rio
from rasterio.enums import Resampling
from rasterio.plot import show
from rasterio.transform import from_gcps
from rasterio.control import GroundControlPoint as GCP
import numpy as np
import tempfile
from .models import Point, pointList

#imports of self-written models
from .models import Point

#mapbox projection crs for web mercator: EPSG:3857
defaultCrs = 'EPSG:3857'

#parameters: tempFilePath, points: list[Point], crs: str
#returns: georeferenced image of type gtiff
def georeferencer(tempFilePath, points: pointList):
    # check if points contain at least 3 point models

    #first convert png to tiff
    tiffFile = png2geotiff(tempFilePath)

    #crate the transform from points
    #points have the fields x, y, lat, lon
    #x and y are the pixel coordinates
    #lat and lon are the geographic coordinates from mapbox projection
    crs = defaultCrs
    transform = createTransform(points)

    # update the transform in the tiff file
    with rio.open(tiffFile, "r+") as src:
        src.crs = crs
        src.transform = transform
        src.write_transform(transform)
    # return transformed tiff
    return tiffFile
        

#function to convert png to Tiff
def png2geotiff(tempFilePath):
    dataset = rio.open(tempFilePath)
    bands = [1, 2, 3] # I assume that you have only 3 band i.e. no alpha channel in your PNG
    data = dataset.read(bands)

    # set the output image kwargs
    kwargs = {
        "driver": "GTiff",
        "width": data.shape[1], 
        "height": data.shape[2],
        "count": len(bands), 
        "dtype": data.dtype, 
        "nodata": 0,
        "crs": defaultCrs
    }

    #creating tempfile
    temp_file = tempfile.NamedTemporaryFile(suffix='.tif').name

    with rio.open(temp_file, "w", **kwargs) as dst:
        dst.write(data, indexes=bands)
    
    #returning the new written file
    return temp_file

#function to create the transform from points
def createTransform(PointList : pointList):
    #check if the pointlist contains at least 3 points
    if len(PointList.points) < 3:
        raise Exception("Not enough points to create a transform")
    #create the GCPs
    gcps = []
    for point in PointList.points:
        gcps.append(GCP(row=point.row, col=point.col, x=point.lon, y=point.lat, id=point.id, info=point.name))
    #create the transform
    transform = from_gcps(gcps)
    #return the transform object
    return transform
