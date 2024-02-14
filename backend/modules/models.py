from pydantic import BaseModel
from typing import List, Optional, Union
from fastapi import UploadFile, File
import tempfile

#geografic point
class Point(BaseModel):
    lat: float
    lon: float
    x: int
    y: int
    error: Union[None, float] = None
    id: Union[int,None] = None
    name: str


#list of points
class pointList(BaseModel):
    points: List[Point] = []


class Project(BaseModel):
    id: int = None
    name: str
    description: Optional[str] = None
    points: Union[pointList, None] = None
    crs: Union[str, None] = None
    imageFilePath: Union[str, None] = None
    georeferencedFilePath: Union[str, None] = None
    selfdestructtime: Union[str, None] = None
    created: Union[str, None] = None
    lastModified: Union[str, None] = None
    def __init__(self, **data):
        super().__init__(**data)
        self.points = pointList(points=[])
        self.imageFilePath = tempfile.NamedTemporaryFile().name
        self.georeferencedFilePath = tempfile.NamedTemporaryFile().name
        self.selfdestructtime = "never"
        self.created = "never"
        self.lastModified = "never"
        self.crs = "EPSG:4326"
    def delete(self):
        #deleiting the temporary files
        try:
            import os
            os.remove(self.imageFilePath)
            os.remove(self.georeferencedFilePath)
        except:
            #try to remove the files using tempfile methods
            try:
                #open the files
                with open(self.imageFilePath, "r+w", closefd=True) as file:
                    file.close()
                with open(self.georeferencedFilePath, "r+w", closefd=True) as file:
                    file.close()
            except:
                raise Exception(status_code=500, detail="Could not delete the project files")
        return
    def __del__(self):
        self.delete()
    
    def uploadImage(self, image: UploadFile):
        #create temporary file
        
        with open(self.imageFilePath, "wb") as file:
            file.write(image.file.read())
        return


