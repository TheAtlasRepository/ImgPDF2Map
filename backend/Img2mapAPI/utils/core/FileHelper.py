import os

#checking if /tmp folder exists
def getTmpFolderPath():
    if not os.path.exists('./temp'):
        os.makedirs('./temp')
    return './temp'

def getUniqeFileName(suffix : str, length=8):
    #create a random file name between 8 cha, xxxx-xxxx.
    import random
    import string
    #chec if temp folder exists
    if not os.path.exists('./temp'):
        getTmpFolderPath()

    #remove the dot from the suffix if exists
    if suffix[0] == '.':
        suffix = suffix[1:]
    suffix = suffix.lower()
    #check if the file name is unique in the temp folder
    i = 0
    while True:
        #create a random file name
        randomName = ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))
        #check if the file name exists
        if not os.path.isfile(f"./temp/{randomName}.{suffix}"):
            return f"./temp/{randomName}.{suffix}"
        #raise an exception if max tries is reached
        if i == 100:
            raise Exception("Could not create a unique file name")
        i += 1

def removeFile(filePath):
    #remove the file if it exists
    if os.path.isfile(filePath):
        os.remove(filePath)

def createEmptyFile(suffix):
    #create a temporary file
    with open(getUniqeFileName(suffix), "w") as file:
        file.write("")
    return file.name