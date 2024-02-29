import os
import tempfile
from .fileStorage import FileStorage

_tempPath = "./temp"
if not os.path.exists(_tempPath):
    os.makedirs(_tempPath)

#File storage using the local file system
class LocalFileStorage(FileStorage):
    #temp folder should be in main script folder
    _instance = None
    tempPath = _tempPath
    tempFolder = tempfile.mkdtemp(dir=_tempPath)
   
    async def saveFile(self, data: bytes, suffix: str) -> str:
        #create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix, dir=self.tempFolder) as file:
            file.write(data)
            path = file.name
        return path
    async def removeFile(self, path: str):
        #remove the file
        os.remove(path)
    async def readFile(self, path: str)->bytes:
        #open the file
        with open(path, "rb") as file:
            data = file.read()
        return data
    async def fileExists(self, path: str)->bool:
        #check if the file exists
        return os.path.isfile(path)
    
    @staticmethod
    def getInstance():
        if LocalFileStorage._instance is None:
            LocalFileStorage._instance = LocalFileStorage()
        return LocalFileStorage._instance
    
    #shutdown cleanup
    def __del__(self):
        #remove the temp folder
        os.rmdir(self.tempFolder)
        #remove the temp folder if it is empty
        if len(os.listdir(self.tempPath)) == 0:
            os.rmdir(self.tempPath)
        
    def __exit__(self, exc_type, exc_value, traceback):
        #remove the temp folder
        os.rmdir(self.tempFolder)
        #remove the temp folder if it is empty
        if len(os.listdir(self.tempPath)) == 0:
            os.rmdir(self.tempPath)
  
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance