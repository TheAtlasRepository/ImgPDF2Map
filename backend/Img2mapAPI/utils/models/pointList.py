from typing import List
from .point import Point
from .coreModel import CoreModel
# model for the pointList

class PointList(CoreModel):
    points: List[Point] = []
    def __init__(self, **data):
        super().__init__(**data)
        self.points = []
    def __dict__(self):
        return [point.__dict__() for point in self.points]
    def __iter__(self):
        return iter(self.points)