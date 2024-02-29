from typing import Optional, Union, List
from fastapi import UploadFile
from pydantic import BaseModel
from .pointList import PointList
from ..core.FileHelper import createEmptyFile

class Project(BaseModel):
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
    