from pydantic import BaseModel
from typing import Union, Optional


class Point(BaseModel):
     lat: float
     lng: float
     col: int
     row: int
     error: Union[None, float] = None
     id: Union[int,None] = None # id of the point in the database
     name: Optional[str] = None
     description: Optional[str] = None
     projectId: Optional[int] = None
     Idproj: Union[int,None] = None # id of the point in the project
 