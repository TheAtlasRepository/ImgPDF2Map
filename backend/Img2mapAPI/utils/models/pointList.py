from typing import List
from pydantic import BaseModel
from .point import Point
# model for the pointList

class PointList(BaseModel):
    points: List[Point] = []