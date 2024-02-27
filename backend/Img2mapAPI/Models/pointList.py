from typing import List
from pydantic import BaseModel
from .Point import Point
# model for the pointList

class PointList(BaseModel):
    points: List[Point] = []