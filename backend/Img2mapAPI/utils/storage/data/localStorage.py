from .storageHandler import StorageHandler
from img2mapAPI.devOnly.localrepository.repository import Repository
from ...models.coreModel import CoreModel

# This class is a subclass of StorageHandler and is used to handle local storage, it iteracts with the singleton repository to save, fetch, update and remove data
#Local storage handler
class LocalStorage(StorageHandler):
    _instance = None
    repo: Repository = None

    def __init__(self, repo: Repository):
        self.repo: Repository = repo
    
    async def connect(self, db: str, user: str, password: str, host: str, port: int) -> None:
        #not needed in this local storage
        pass
    
    async def saveInStorage(self, data: CoreModel, type: str, pkName: str = 'id') -> int:
        #convert the data to a dictionary
        data = data.__dict__
        #save the data to the repository
        id = await self.repo.insert(type, pkName, data)
        return id
    
    #implementing the abstract method
    async def remove(self, id: int, type: str):
        self.repo.remove(type, id)
    #implementing the abstract method
    async def update(self, id: int, data: CoreModel, type: str):
        self.repo.update(type, id, data.__dict__)
    #implementing the abstract method
   
    async def fetchOne(self, id: int, type: str):
        ret = await self.repo.fetch(type, id)
        return ret
    
    async def fetch(self, type: str, params: dict = {}):
        ret = await self.repo.query(type, params)
        return ret
    
    async def fetchAll(self, type: str):
        ret = await self.repo.fetchAllRows(type)
        return ret
    
    def __new__(cls, repo: Repository):
        if cls._instance is None:
            cls._instance = super(LocalStorage, cls).__new__(cls)
            cls._instance.__init__(repo)
        return cls._instance
    