import os #importing os for file operations
import rasterio as rio #importing rasterio for georeferencing
from rasterio.transform import from_gcps #importing from_gcps to create a transform from GCPs
from rasterio.control import GroundControlPoint as GCP 
from rasterio.crs import CRS #importing CRS for the default crs
from ..models import PointList #importing the pointList model
from .FileHelper import getUniqeFileName, removeFile #importing the getUniqeFileName and removeFile functions from FileHelper

defaultCrs = 'EPSG:4326'

def createGcps(PointList : PointList):
    """Create Rasterio GCPs from a list of points"""
    if len(PointList.points) < 3:
        raise Exception("Not enough points to create a transform")

    # Check if points have Idproj
    if not PointList.points[0].Idproj:
        raise Exception("Points don't have Idproj")

    gcps = []  # Create the GCPs list

    for point in PointList.points:
        description = f"Point {point.Idproj} at ({point.lat}, {point.lng})"

        if point.error:
            description += f" with error {point.error}"
        if point.name:
            description += f" with name {point.name}"
        if point.description:
            description += f" with description {point.description}"

        gcps.append(
            GCP(
                row=point.row,
                col=point.col,
                x=point.lng,
                y=point.lat,
                id=point.Idproj,
                info=description
            )
        )
    return gcps

def InitialGeoreferencePngImage(tempFilePath, points: PointList, crs: str = defaultCrs)->str: 
    """
    # Georeference a PNG image with a list of points and a crs
    **Arguments:**
        tempFilePath {str} -- The path to the temporary file
        points {PointList} -- The list of points
        crs {str} -- The crs of the image
    **Returns:**
        str -- The path to the georeferenced file
    """
    gcps = createGcps(points) #creating the GCPs

    #create png file in the temp folder
    filename = getUniqeFileName('.png')
    with open(filename, "wb") as file:
        file.write(open(tempFilePath, "rb").read())
    
    #Read the png file
    dataset = rio.open(tempFilePath, "r", driver="PNG")
    bands = [1, 2, 3] # I assume that you have only 3 band i.e. no alpha channel in your PNG
    data = dataset.read(bands)
    
    # set the output image kwargs
    kwargs = {
        "driver": "GTiff",
        "width": data.shape[2], 
        "height": data.shape[1],
        "count": len(bands), 
        "dtype": data.dtype, 
        "nodata": 0,
    }
    
    path = getUniqeFileName('.tiff') #filepath for the new file

    #writing the data to the new file
    produced_file = rio.open(path, "w+", **kwargs)
    produced_file.write(data, indexes=bands)
    produced_file.close()
   
    #transforming the file to a georeferenced file
    dataset = rio.open(path, "r+") #open the new file
    transform = from_gcps(gcps) #create the transform
    dataset.transform = transform #set the transform
    dataset.crs = CRS.from_string(crs) #set the crs
    dataset.close()

    removeFile(filename) #removing the temporary file
    return path

def reGeoreferencedImageTiff(innFilePath, points: PointList, crs: str = defaultCrs)->str:
    """
    Function to re-georeference a Gtiff image with a list of points and a crs
    Arguments:
        innFilePath {str} -- The path to the image file
        points {PointList} -- The list of points
        crs {str} -- The crs of the image
    Returns:
        str -- The path to the georeferenced file
    """
    #safety checks
    if not os.path.isfile(innFilePath):
        raise Exception("File not found")
    with rio.open(innFilePath, "r") as file:
        if file.count == 0:
            raise Exception("File has no data")
    
    gcps = createGcps(points) #creating the GCPs
    filename = getUniqeFileName('.tiff') #creating a working file
    tempFilePath = f"temp/{filename}"

    #copy the file to the temp folder
    with open(tempFilePath, "wb") as file:
        file.write(open(innFilePath, "rb").read())

    #open the georeferenced file and geo-reference it
    dataset = rio.open(tempFilePath, "r+") 
    transform = from_gcps(gcps) #create the transform
    dataset.transform = transform #set the transform
    dataset.crs = CRS.from_string(crs) #set the crs
    dataset.close() #close the file

    return tempFilePath

