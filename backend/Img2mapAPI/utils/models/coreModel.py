from pydantic import BaseModel
from typing import List, Optional

class CoreModel(BaseModel):
    #implementing __dict__ method to convert the model to a dictionary
    def __dict__(self):
        return self.__dict__