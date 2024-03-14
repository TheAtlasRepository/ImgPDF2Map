import sqlite3
import os
import sys

#setting the root path
_root_path: str = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
DatabaseFolderPath: str = ''
defaultDBfolder: str = 'database'

def setDatabaseFolder(folder: str):
    global DatabaseFolderPath
    createDBfolder(folder)
    #overwrite the default folder
    DatabaseFolderPath = folder

def createDBfolder(folder: str = defaultDBfolder):
    global DatabaseFolderPath
    #path
    DatabaseFolderPath = os.path.join(_root_path, folder)
    os.makedirs(DatabaseFolderPath, exist_ok=True)

def createNewDatabase(DBName: str):
    createDBfolder()
    #create the database
    db = os.path.join(DatabaseFolderPath, DBName)
    if not os.path.isfile(db):
        #create the database
        conn = sqlite3.connect(db)
        conn.close()
        return db
    else:
        return db
    
