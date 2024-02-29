import os #importing os for file operations
import rasterio as rio #importing rasterio for georeferencing
from rasterio.transform import from_gcps #importing from_gcps to create a transform from GCPs
from rasterio.control import GroundControlPoint as GCP 
from rasterio.crs import CRS #importing CRS for the default crs
from ..models import PointList #importing the pointList model
from .FileHelper import getUniqeFileName, removeFile #importing the getUniqeFileName and removeFile functions from FileHelper

#mapbox projection crs for web mercator: EPSG:3857
defaultCrs = 'EPSG:4326'

#function to create Rasterio GCPs from a list of points
def createGcps(PointList : PointList):
    #check if the pointlist contains at least 3 points
    if len(PointList.points) < 3:
        raise Exception("Not enough points to create a transform")
    #create the GCPs
    gcps = []
    for point in PointList.points:
        gcps.append(GCP(row=point.row, col=point.col, x=point.lng, y=point.lat, id=point.id, info=point.name))
    return gcps

#Main georeferencer function
def georeferencer(tempFilePath, points: PointList, crs: str = defaultCrs)->str: 
    #create the GCPs
    gcps = createGcps(points)

    #create png file in the temp folder
    filename = getUniqeFileName('png')
    tempFPath = f"temp/{filename}"
    #write the file
    with open(tempFPath, "wb") as file:
        file.write(open(tempFilePath, "rb").read())
    
    #Read the png file
    dataset = rio.open(tempFilePath, "r", driver="PNG")
    bands = [1, 2, 3] # I assume that you have only 3 band i.e. no alpha channel in your PNG
    data = dataset.read(bands)
    
    #seting up rasterio environment
    #with rio.env():
        # set the output image kwargs
    kwargs = {
        "driver": "GTiff",
        "width": data.shape[2], 
        "height": data.shape[1],
        "count": len(bands), 
        "dtype": data.dtype, 
        "nodata": 0,
    }
    #filepath
    path = f"temp/{getUniqeFileName('tiff')}"

    #writing the data to the new file
    produced_file = rio.open(path, "w+", **kwargs)
    produced_file.write(data, indexes=bands)
    produced_file.close()
   
    #open the new file
    dataset = rio.open(path, "r+")
    #create the transform
    transform = from_gcps(gcps)
    #set the transform
    dataset.transform = transform
    #set the crs
    dataset.crs = CRS.from_string(crs)
    #save the file
    dataset.close()
    #remove the temporary file
    removeFile(tempFPath)
    #return the path to the georeferenced file
    return path

#function to adjust the georeferenced image with a new point in addition to the old points
def adjustGeoreferencedImage(innFilePath, points: PointList, crs: str = defaultCrs)->str:
    #safty check
    if len(points.points) < 3:
        raise Exception("Not enough points to create a transform")
    if not os.path.isfile(innFilePath):
        raise Exception("File not found")
    #check if the file is a tiff file and has data
    with rio.open(innFilePath, "r") as file:
        if file.count == 0:
            raise Exception("File has no data")
    #create the GCPs
    gcps = createGcps(points)
    #create file in the temp folder
    filename = getUniqeFileName('tiff')
    tempFilePath = f"temp/{filename}"
    #write the file
    with open(tempFilePath, "wb") as file:
        file.write(open(innFilePath, "rb").read())
    #open the georeferenced file
    dataset = rio.open(tempFilePath, "r+")
    #create the transform
    transform = from_gcps(gcps)
    #set the transform
    dataset.transform = transform
    #set the crs
    dataset.crs = CRS.from_string(crs)
    #save the file
    dataset.close()
    #return the path to the georeferenced file
    return tempFilePath

