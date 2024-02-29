#class to mimic a table in the database
class Table:
    """
    A class to represent a Table

    ...

    Attributes
    ----------
    _rows : dict
        a dictionary of rows in the table

    Methods
    -------
    addRow(id: int, row: any) -> None:
        Adds a row to the table
    getRow(id: int) -> any:
        Returns a row from the table
    removeRow(id: int) -> None:
        Removes a row from the table
    updateRow(id: int, row: any) -> None:
        Updates a row in the table
    fetchAll() -> list:
        Returns all the rows in the table
    """
    _instance = None
    _nextId = 1
    
    def __init__(self):
        self._rows = {}

    def addRow(self, id: int, row: any) -> None:
        """
        Adds a row to the table

        Arguments:
            id {int} -- The id of the row
            row {any} -- The row to be added
        """
        self._rows[id] = row
        self._nextId += 1


    def getRow(self, id: int) -> any:
        """
        Returns a row from the table

        Arguments:
            id {int} -- The id of the row

        Returns:
            any -- The row
        """
        return self._rows[id]

    def removeRow(self, id: int) -> None:
        """
        Removes a row from the table

        Arguments:
            id {int} -- The id of the row
        """
        del self._rows[id]

    def updateRow(self, id: int, row: any) -> None:
        """
        Updates a row in the table

        Arguments:
            id {int} -- The id of the row
            row {any} -- The row to be updated
        """
        self._rows[id] = row

    def fetchAll(self) -> list:
        """
        Returns all the rows in the table

        Returns:
            list -- The rows
        """
        return list(self._rows.values())
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Table, cls).__new__(cls)
        return cls._instance