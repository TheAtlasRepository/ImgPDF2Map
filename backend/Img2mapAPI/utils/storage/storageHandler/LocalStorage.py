from .StorageHandler import StorageHandler

#Local storage handler
class LocalStorage(StorageHandler):
    def save(self, data, type):
        return data
    def fetchOne(self, id, type):
        return id
    def remove(self, id, type):
        return id
    def update(self, id, data, type):
        return id
    def fetch(self, type, params):
        return type
    def fetchAll(self, type):
        return type