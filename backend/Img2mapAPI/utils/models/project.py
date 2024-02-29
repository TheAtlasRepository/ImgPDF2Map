from typing import Optional, Union, List
from fastapi import UploadFile
from pydantic import BaseModel
from .pointList import PointList
from .coreModel import CoreModel
from ..core.FileHelper import createEmptyFile

class Project(CoreModel):
    id: int = None
    name: str
    description: Optional[str] = None
    points: Union[PointList, None] = None
    crs: Union[str, None] = None
    imageFilePath: Union[str, None] = None
    georeferencedFilePath: Union[str, None] = None
    selfdestructtime: Union[str, None] = None
    created: Union[str, None] = None
    lastModified: Union[str, None] = None
    
    def __init__(self, **data):
        super().__init__(**data)
        self.points = PointList(points=[])
        self.imageFilePath = ""
        self.georeferencedFilePath = ""
        self.selfdestructtime = "never"
        self.created = "never"
        self.lastModified = "never"
        self.crs = "EPSG:4326"
    
    def __dict__(self):
        #convert the fields to a dictionary
        dict = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "points": self.points,
            "crs": self.crs,
            "imageFilePath": self.imageFilePath,
            "georeferencedFilePath": self.georeferencedFilePath,
            "selfdestructtime": self.selfdestructtime,
            "created": self.created,
            "lastModified": self.lastModified
        }
        #overriding the points field to convert it to a dictionary
        dict["points"] = self.points.__dict__()
        return dict