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
    _tables = {}

    def __init__(self):
        self.addTable("project", Table())
        self.addTable("point", Table())

    def addTable(self, tableName: str, table: Table) -> None:
        """
        Adds a table to the repository

        Arguments:
            name {str} -- The name of the table
            table {Table} -- The table to be added
        """
        self._tables[tableName] = table

    async def getTable(self, tableName: str) -> Table:
        """
        Returns a table from the repository

        Arguments:
            name {str} -- The name of the table

        Returns:
            Table -- The table
        """
        return self._tables[tableName]
    
    async def fetchAll(self):
        return self._tables
    
    async def fetchAllRows(self, tableName: str):
        return self._tables[tableName].rows

    async def removeTable(self, tableName: str):
        del self._tables[tableName]
    
    async def updateTable(self, tableName: str, table: Table):
        self._tables[tableName] = table
    
    async def fetch(self, tableName: str):
        if tableName == '*':
            return self._tables
        return self._tables[tableName]
    
    async def fetch(self, name: str, id: int):
        table: Table = self._tables[name]
        rowdict:dict = table.getRow(id)
        return rowdict
    
    #TODO: Fix the query function
    async def query(self, tableName: str, query: dict) -> list:
        table: Table = self._tables[tableName]
        allTablerows: dict = table.rows
        rows = []
        if allTablerows == {}: return rows
        #iterate over the rows row structure is {id: {column: value, column: value}}
        for key, value in allTablerows.items():
            #iterate over the query structure is {column: value}
            #if the row has the same key value pairs as the query add it to the rows
            if all(value.get(qkey) == qvalue for qkey, qvalue in query.items()):
                rows.append(value)
        return rows
  
    async def insert(self, tableName: str, pkcolumn: str, data: dict) -> int:
        #get the table
        table: Table = self._tables[tableName]
        #find the next id update the data with it
        data[pkcolumn] = table.nextId
        #add the row
        table.addRow(data[pkcolumn], data)
        return data[pkcolumn]

    #update the database
    async def update(self, tableName: str, id: int, data: dict):
        #get the table
        table: Table = self._tables[tableName]
        #update the row
        table.updateRow(id, data)

    #remove a row from the database
    async def remove(self, tableName: str, id: int):
        #get the table
        table: Table = self._tables[tableName]
        #remove the row
        table.removeRow(id)

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Repository, cls).__new__(cls)
        return cls._instance

