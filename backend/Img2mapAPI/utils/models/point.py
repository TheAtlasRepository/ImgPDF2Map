from typing import Union, Optional
from .coreModel import CoreModel


class Point(CoreModel):
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
     
     def __init__(self, **data):
          super().__init__(**data)
          self.lat = 0
          self.lng = 0
          self.col = 0
          self.row = 0
          self.error = None
          self.id = None
          self.name = None
          self.description = None
          self.projectId = None
          self.Idproj = None
     
     def __dict__(self):
          return {
               "lat": self.lat,
               "lng": self.lng,
               "col": self.col,
               "row": self.row,
               "error": self.error,
               "id": self.id,
               "name": self.name,
               "description": self.description,
               "projectId": self.projectId,
               "Idproj": self.Idproj
          }
     