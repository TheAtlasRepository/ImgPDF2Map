import rasterio as rio
from rasterio.enums import Resampling
from rasterio.plot import show

#imports of self-written models
from .models import Point

#parameters: tempFilePath, points: list[Point], crs: str
#returns: georeferenced image of type gtiff
def georeferencer(tempFilePath, points, crsIn):
    #open the image
    with rio.open(tempFilePath) as src:
        #create a new image with the same dimensions and the same crs
        with rio.open('georeferenced.tif', 'w', driver='GTiff',
            width=src.width,
            height=src.height,
            count=src.count,
            crs=crsIn,
            transform=src.transform,
            dtype=src.dtypes[0]) as dst:
            #loop through the points and write the coordinates to the image
            for point in points:
                dst.write(point.x, point.y, point.lat, point.lon)
            #return the georeferenced image
            return dst
            