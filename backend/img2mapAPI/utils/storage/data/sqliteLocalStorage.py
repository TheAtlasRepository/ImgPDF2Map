import sqlite3 as sql
import os
from typing import Union
from pydantic import BaseModel
from img2mapAPI.utils.storage.data.storageHandler import StorageHandler as sh

class SQLiteStorage(sh):
    _instance = None
    db: sql.Connection = None

    def __init__(self, db: str = 'test.db', user: str = 'admin', password: str = 'admin', host: str = 'localhost', port: int= 0):
        self.db = None
        if db is not None:
            #crete the path to the database
            db = os.path.join(os.path.dirname(__file__), db)
        self.connect(db, user, password, host, port)

    async def connect(self, db: str, user: str, password: str, host: str, port: int)->None:
        if not os.path.isfile(db):
            #create the database
            self.db = sql.connect(db)
            self.db.row_factory = sql.Row
        else:    
            self.db = sql.connect(db)
            self.db.row_factory = sql.Row
        cursor = self.db.cursor()
        #create the table for the project
        cursor.execute('''CREATE TABLE IF NOT EXISTS project(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        description TEXT,
                        crs TEXT,
                        imageFilePath TEXT,
                        georeferencedFilePath TEXT,
                        selfdestructtime TEXT,
                        created TEXT,
                        lastModified TEXT)'''
                        )
        #create the table for the points
        cursor.execute('''CREATE TABLE IF NOT EXISTS point(
                        id INTEGER PRIMARY KEY,
                        projectId INTEGER NOT NULL,
                        Idproj INTEGER NOT NULL,
                        lat REAL NOT NULL,
                        lng REAL NOT NULL,
                        row INTEGER NOT NULL,
                        col INTEGER NOT NULL,
                        error REAL,
                        name TEXT,
                        description TEXT,
                        FOREIGN KEY(project_id) REFERENCES project(id))'''
                        )
        self.db.commit()

    async def saveInStorage(self, data: BaseModel, type: str, pkName:str = 'id')->int:
        data = dict(data)
        if self.db is None:
            try:
                self.connect('test.db', 'admin', 'admin', 'localhost', 0)
            except:
                raise Exception('Database connection failed')
        cursor = self.db.cursor()
        #should return the id of the saved data
        try:
            await cursor.execute(f'INSERT INTO {type}({",".join(data.keys())}) VALUES({",".join(["?"]*len(data.keys()))})', list(data.values()))
            self.db.commit()
        except Exception as e:
            print(e)
            #if the data is not saved raise an exception
            raise Exception('Data not saved')
        return cursor.lastrowid
    

    async def remove(self, id: int, type: str)->None:
        cursor = self.db.cursor()
        try:
            await cursor.execute(f'DELETE FROM {type} WHERE id = ?', (id,))
            self.db.commit()
        except:
            raise Exception('Data removal failed')

    async def update(self, id: int, data: BaseModel, type: str)->None:
        data = dict(data)
        cursor = self.db.cursor()
        try:
            await cursor.execute(f'UPDATE {type} SET {",".join([f"{key} = ?" for key in data.keys()])} WHERE id = ?', list(data.values()) + [id])
            self.db.commit()
        except:
            raise Exception('Data update failed')

    async def fetchOne(self, id: int, type: str) -> Union[None, dict]:
        cursor = self.db.cursor()
        retDict = {}
        try:
            await cursor.execute(f'SELECT * FROM {type} WHERE id = ?', (id,))
            ret = cursor.fetchone()
            if ret is not None:
                for key in ret.keys():
                    retDict[key] = ret[key]
        except:
            raise Exception('Data fetch failed')
        return retDict
    
    async def fetch(self, type: str, params: dict = {})->Union[None ,list, dict]:
        cursor = self.db.cursor()
        retList = []
        try:
            if params == {}:
                await cursor.execute(f'SELECT * FROM {type}')
            else:
                await cursor.execute(f'SELECT * FROM {type} WHERE {",".join([f"{key} = ?" for key in params.keys()])}', list(params.values()))
            ret = cursor.fetchall()
            if ret is not None:
                for row in ret:
                    retDict = {}
                    for key in row.keys():
                        retDict[key] = row[key]
                    retList.append(retDict)
        except:
            raise Exception('Data fetch failed')
        return retList
    
    async def fetchAll(self, type: str)->Union[None, list]:
        cursor = self.db.cursor()
        retList = []
        try:
            await cursor.execute(f'SELECT * FROM {type}')
            ret = cursor.fetchall()
            if ret is not None:
                for row in ret:
                    retDict = {}
                    for key in row.keys():
                        retDict[key] = row[key]
                    retList.append(retDict)
        except:
            raise Exception('Data fetch failed')
        return retList

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SQLiteStorage, cls).__new__(cls)
            cls._instance.__init__()
        return cls._instance

