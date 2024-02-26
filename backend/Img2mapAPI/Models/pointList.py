from typing import List
from pydantic import BaseModel
from .point import Point
# model for the pointList

class pointList(BaseModel):
    points: List[Point] = []