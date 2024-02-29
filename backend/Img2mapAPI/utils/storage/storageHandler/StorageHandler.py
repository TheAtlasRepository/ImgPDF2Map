from abc import ABC, abstractmethod

#Abstract class for moving data to and from storage/DB and the API server
class StorageHandler(ABC):
    #abstract method for saving data, returns the id of the saved data. Takes the data and the type of the data as input
    @abstractmethod
    def save(self, data, type: str)->int:
        pass
    #abstract method for reading data, returns the data. Takes the id and the type of the data as input
    @abstractmethod
    def fetchOne(self, id: int, type: str):
        pass
    #abstract method for removing data. Takes the id and the type of the data as input
    @abstractmethod
    def remove(self, id: int, type: str):
        pass
    #abstract method for updating data. Takes the id, the data and the type of the data as input
    @abstractmethod
    def update(self, id: int, data, type: str):
        pass
    #abstract method for listing data. Takes the type of the data as input
    @abstractmethod
    def fetch(self, type: str, params: dict = {}):
        pass
    #abstract method for fetching all data. Takes the type of the data as input
    @abstractmethod
    def fetchAll(self, type: str):
        pass
    