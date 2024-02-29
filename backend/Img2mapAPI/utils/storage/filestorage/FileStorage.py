#Abstract class for file storage
from abc import ABC, abstractmethod

class FileStorage(ABC):
    @abstractmethod
    def save(self, data: bytes, suffix: str)->str:
        pass
    @abstractmethod
    def remove(self, path: str):
        pass
    @abstractmethod
    def read(self, path: str)->bytes:
        pass
    @abstractmethod
    def exists(self, path: str)->bool:
        pass

