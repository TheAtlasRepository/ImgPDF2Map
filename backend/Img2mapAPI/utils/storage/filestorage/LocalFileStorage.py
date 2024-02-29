import os
import tempfile
from .FileStorage import FileStorage

#File storage using the local file system
class LocalFileStorage(FileStorage):
    def save(self, data: bytes, suffix: str)->str:
        #create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as file:
            file.write(data)
            path = file.name
        return path
    def remove(self, path: str):
        #remove the file
        os.remove(path)
    def read(self, path: str)->bytes:
        #open the file
        with open(path, "rb") as file:
            data = file.read()
        return data
    def exists(self, path: str)->bool:
        #check if the file exists
        return os.path.isfile(path)