from pydantic import BaseModel

#geografic point
class Point(BaseModel):
    #latitude and longitude
    latitude: float
    longitude: float
    #image pixel coordinates
    x: int
    y: int
    #point error after triangulation
    error: float
    #point id
    id: int
    #point name
    name: str


#
