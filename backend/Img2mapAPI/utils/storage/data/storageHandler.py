from abc import ABC, abstractmethod
from typing import List, Union 

#Abstract class for moving data to and from storage/DB and the API server
class StorageHandler(ABC):
    #abstarct fileds
    db = None

    #abstract methods
    @abstractmethod
    async def connect(self, db: str, user: str, password: str, host: str, port: int)->None:
        """
        Connect to the storage
        
        Arguments:
            db {str} -- The name of the database
            user {str} -- The username
            password {str} -- The password
            host {str} -- The host
            port {int} -- The port
        """
        pass

    @abstractmethod
    async def saveInStorage(self, data, type: str, pkName:str = 'id')->int:
        """
        Save data to storage and return the id of the saved data
        
        Arguments:
            data {any} -- The data to be saved
            type {str} -- The type of the data / the table name / the model class name
            pkName {str} -- The primary key name
        return {int} -- The id of the saved data
        """
        pass

    @abstractmethod
    async def remove(self, id: int, type: str)->None:
        """
        Remove data from storage

        Arguments:
            id {int} -- The id of the data
            type {str} -- The type of the data / the table name / the model class name
        """
        pass

    @abstractmethod
    async def update(self, id: int, data, type: str)->None:
        """
        Update data in storage
        
        Arguments:
            id {int} -- The id of the data
            data {any} -- The data to be updated
            type {str} -- The type of the data / the table name / the model class name
        """
        pass
    
    @abstractmethod
    async def fetchOne(self, id: int, type: str) -> Union[None, dict]:
        """
        Fetch one data from storage

        Arguments:
            id {int} -- The id of the data
            type {str} -- The type of the data / the table name / the model class name
        """
        pass

    @abstractmethod
    async def fetch(self, type: str, params: dict = {})->Union[None ,List[dict], dict]:
        """
        Fetch data from storage
        
        Arguments:
            type {str} -- The type of the data / the table name / the model class name
            params {dict} -- The parameters to filter the data
        """
        pass

    @abstractmethod
    async def fetchAll(self, type: str)->Union[None, List[dict]]:
        """
        Fetch all data from storage

        Arguments:
            type {str} -- The type of the data / the table name / the model class name
        """
        pass