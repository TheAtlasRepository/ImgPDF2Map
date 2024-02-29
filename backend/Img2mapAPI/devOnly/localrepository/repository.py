#singelton class holding the "tabesl" of the database
from .table import Table

class Repository:
    """
    A class to represent a Repository

    ...

    Attributes
    ----------
    _tables : dict
        a dictionary of tables in the database

    Methods
    -------
    addTable(name: str, table: Table) -> None:
        Adds a table to the repository
    getTable(name: str) -> Table:
        Returns a table from the repository
    """
    _instance = None

    def __init__(self):
        self._tables = {}
        #adding the tables
        self.addTable("projects", Table())
        self.addTable("points", Table())

    def addTable(self, name: str, table: Table) -> None:
        """
        Adds a table to the repository

        Arguments:
            name {str} -- The name of the table
            table {Table} -- The table to be added
        """
        self._tables[name] = table

    def getTable(self, name: str) -> Table:
        """
        Returns a table from the repository

        Arguments:
            name {str} -- The name of the table

        Returns:
            Table -- The table
        """
        return self._tables[name]
    
    def fetchAll(self):
        return self._tables
    
    def removeTable(self, name: str):
        del self._tables[name]
    
    def updateTable(self, name: str, table: Table):
        self._tables[name] = table
    
    def fetch(self, name: str):
        if name == '*':
            return self._tables
        return self._tables[name]
    
    def fetch(self, name: str, id: int):
        return self._tables[name].getRow(id)
    
    #query the database
    def query(self, table: str, query: dict):
        #get the table
        table = self._tables[table]
        #get all the rows
        rows = table._rows
        #filter the rows
        for key in query:
            rows = {k: v for k, v in rows.items() if k == key}
        return rows
  
    def insert(self, table: str, pkcolumn: str, data: dict):
        #get the table
        table = self._tables[table]
        #find the next id update the data with it
        data[pkcolumn] = table._nextId
        #add the row
        table.addRow(data[pkcolumn], data)
        return data[pkcolumn]

    #update the database
    def update(self, table: str, id: int, data: dict):
        #get the table
        table = self._tables[table]
        #update the row
        table.updateRow(id, data)

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Repository, cls).__new__(cls)
        return cls._instance

