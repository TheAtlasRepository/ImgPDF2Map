#Abstract class for file storage
from abc import ABC, abstractmethod
import tempfile

class FileStorage(ABC):
    @abstractmethod
    async def saveFile(self, data: tempfile, suffix: str)->str:
        pass
    @abstractmethod
    async def removeFile(self, path: str):
        pass
    @abstractmethod
    async def readFile(self, path: str)->bytes:
        pass
    @abstractmethod
    async def fileExists(self, path: str)->bool:
        pass
    
    @abstractmethod
    async def saveFileFromPath(self, path: str, suffix: str)->str:
        pass
