from pydantic import BaseModel
from typing import List, Optional, Union
from fastapi import UploadFile, File
import tempfile

#geografic point
class Point(BaseModel):
    latitude: float
    longitude: float
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


