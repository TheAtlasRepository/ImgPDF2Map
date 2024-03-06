from typing import Optional, Union, List
from pydantic import BaseModel
from .pointList import PointList
from ..core.FileHelper import createEmptyFile
import datetime

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
        self.points = data.get('points') if data.get('points') is not None else PointList()
        self.imageFilePath = data.get('imageFilePath') if data.get('imageFilePath') is not None else None
        self.georeferencedFilePath = data.get('georeferencedFilePath') if data.get('georeferencedFilePath') is not None else None
        self.crs = data.get('crs') if data.get('crs') is not None else None
        self.selfdestructtime = data.get('selfdestructtime') if data.get('selfdestructtime') is not None else None
        self.created = data.get('created') if data.get('created') is not None else datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.lastModified = data.get('lastModified') if data.get('lastModified') is not None else datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.id = data.get('id') if data.get('id') is not None else None
        self.name = data.get('name') if data.get('name') is not None else ''
        self.description = data.get('description') if data.get('description') is not None else None
            
    