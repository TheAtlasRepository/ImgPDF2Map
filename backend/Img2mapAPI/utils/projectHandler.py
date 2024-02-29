# This is the project handeler file. It contains the functions to handle the project data.
# The functions in this file are used to create, update, delete and get projects and points.
# The project data is stored in a list in the router file.

# Importing the required modules
from typing import List, Union
from img2mapAPI.utils.models import Project, Point
from .storage.files.fileStorage import FileStorage
from .storage.data.storageHandler import StorageHandler
from .core import georefHelper as georef
import datetime

class ProjectHandler:
    _FileStorage: FileStorage = None
    _StorageHandler: StorageHandler = None

    def __init__(self, FileS: FileStorage, SHandler: StorageHandler):
        self._FileStorage = FileS
        self._StorageHandler = SHandler
    
    # Function to create a project
    async def createProject(self, project: Project) -> int:
        """
        Create a project and save it to storage
        return the id of the created project
        """
        #clear or set the needed fields
        project.id = None
        project.imageFilePath = ""
        project.georeferencedFilePath = ""
        project.selfdestructtime = None #TODO: add self destruct time logic
        project.created = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        project.lastModified = None
        project.points = None
        ID = await self._StorageHandler.saveInStorage(project, "project")
        return ID
    
    # Function to update a project
    async def updateProject(self, projectId: int, project: Project) -> bool:
        """
        Update a project
        """
        fetchedProject = await self._StorageHandler.fetchOne(projectId, "project")
        if fetchedProject is None:
            raise Exception("Project not found")
        #check fields that are not allowed to be updated
        fetchedProject = Project(**fetchedProject)
        project.id = projectId
        project.created = fetchedProject.created
        project.lastModified = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        #compare the fetched project with the updated project and update allowed fields, points and image files are sent to other functions to be handled
        innProject = project.__dict__
        fetchedProjectDict = fetchedProject.__dict__
        specialFields = ["id", "created", "lastModified", "points"]
        for key in fetchedProjectDict:
            if key in innProject:
                if key == "points":
                    self.updatePoints(projectId, project.points)
                #cheking special fields
                elif key not in specialFields:
                    if fetchedProjectDict[key] != innProject[key]:
                        fetchedProjectDict[key] = innProject[key]
        self._StorageHandler.update(projectId, fetchedProjectDict, "project")
        return True
 
    # Function to delete a project
    async def deleteProject(self, projectId: int) -> None:
        """
        Delete a project
        """
        #find the project and remove it
        project = await self._StorageHandler.fetchOne(projectId, "project")
        if project is None:
            raise Exception("Project not found")
        #remove the image and georeferenced files
        if project["imageFilePath"] != "":
            await self._FileStorage.remove(project["imageFilePath"])
        if project["georeferencedFilePath"] != "":
            await self._FileStorage.remove(project["georeferencedFilePath"])
        #delete project points
        points = await self._StorageHandler.fetch("point", {"projectId": projectId})
        for point in points:
            self._StorageHandler.remove(point["id"], "point")
        #remove the project
        self._StorageHandler.remove(projectId, "project")
    
    # Function to get a project by id
    async def getProject(self, projectId: int) -> Project:
        """
        Get a project by id
        """
        #Convert the data to a project object
        project = await self._StorageHandler.fetchOne(projectId, "project")
        project = Project(**project)
        if project is None:
            raise Exception("Project not found")
        return project

    # Function to get all projects
    async def getProjects(self) -> List[Project]:
        """
        Get all projects
        """
        #Convert the data to a list of project objects
        projects = self._StorageHandler.fetchAll("project")
        list: List[Project] = [Project(**project) for project in projects]
        if len(list) == 0:
            raise Exception("No projects found")
        return list
    
    ### Points

    async def getProjectPoints(self, projectId: int) -> List[Point]:
        """
        Get all points of a project
        """
        #Convert the data to a list of point objects
        return [Point(**point) for point in self._StorageHandler.fetch("point", {"projectId": projectId})]
    
    async def removePoint(self, projectId: int, pointId: int) -> bool:
        """
        Remove a point from a project
        """
        points = await self._StorageHandler.fetch("point", {"projectId": projectId})
        #check if the point exists and remove it
        points = [Point(**point) for point in points]
        for point in points:
            if point.id == pointId:
                self._StorageHandler.remove(point.id, "point")
                return True
        raise Exception("Point not found")
                
    async def updatePoints(self, projectId: int, points: List[Point]) -> None:
        """
        Update the points of a project
        """
        if self.validatepoints(points) == False:
            raise Exception("Invalid points")
        #existing points
        pointsInStorage = await self._StorageHandler.fetch("point", {"projectId": projectId})
        #comapre the points in storage with the updated points and update the points
        for point in points:
            if point.id is None | point.id == 0:
                self.addPoint(projectId, point)
            else:
                #update the point in the storage
                self.updatePoint(projectId, point.id, point)

    async def addPoint(self, projectId: int, point: Point) -> int:
        """
        Add a point to a project
        """
        if self.validatepoints([point]) == False:
            raise Exception("Invalid point")
        #set the projectId of the point
        point.projectId = projectId
        point.id = None
        point.error = None
        #find the next idproj = 1
        points = await self._StorageHandler.fetch("point", {"projectId": projectId})
        points = [Point(**point) for point in points]
        if len(points) == 0:
            point.Idproj = 1
        else:
            point.Idproj = max([point.Idproj for point in points]) + 1
        #save the point to storage
        dbid = await self._StorageHandler.save(point, "point")
        return dbid

    async def updatePoint(self, projectId: int, pointId: int, point: Point) -> bool:
        """
        Update a point of a project
        """
        if self.validatepoints([point]) == False:
            raise Exception("Invalid point")
        points = await self._StorageHandler.fetch("point", {"projectId": projectId})
        #check if the point exists and get the point
        points = [Point(**point) for point in points]
        fetchedPoint = None
        for p in points:
            if p.Idproj == pointId:
                fetchedPoint = p
                break
        if fetchedPoint is None:
            raise Exception("Point not found")
        specialFields = ["id", "projectId", "Idproj"]
        #compare the point with the updated point and update allowed fields
        innPointDict = point.__dict__
        fetchedPointDict = fetchedPoint.__dict__

        for key in fetchedPointDict:
            if key in innPointDict:
                if key not in specialFields:
                    if fetchedPointDict[key] != innPointDict[key]:
                        fetchedPointDict[key] = innPointDict[key]
        #update the point in the storage
        await self._StorageHandler.update(fetchedPointDict["id"], fetchedPointDict, "point")
        return True

    async def getPoint(self, projectId: int, pointId: int) -> Point:
        """
        Get a point of a project by id
        """
        #Convert the data to a point object
        point = await self._StorageHandler.fetchOne(pointId, "point")
        if point is None:
            #search by Idproj
            points = await self._StorageHandler.fetch("point", {"projectId": projectId})
            points = [Point(**point) for point in points]
            for p in points:
                if p.Idproj == pointId:
                    point = p
                    break
            raise Exception("Point not found")
        point = Point(**point)
        return point

    async def validatepoints(self, points: List[Point]) -> bool:
        """
        Validate the points
        """
        #check if the points are valid
        for point in points:
            if point.col is None or point.row is None:
                return False
            if point.lat is None or point.lng is None:
                return False
        return True
    
    ### Files

    async def saveImageFile(self, projectId: int, file: bytes, fileType: str) -> None:
        """
        Save the image file of a project
        """
        #only accept png
        if fileType.find("png") == -1:
            raise Exception(status_code=415, description="Invalid file type")
        #save the image file
        filePath = await self._FileStorage.saveFile(file, ".png")
        #update the project with the file path
        project = await self._StorageHandler.fetchOne(projectId, "project")
        project["imageFilePath"] = filePath
        await self._StorageHandler.update(projectId, project, "project")

    async def saveGeoreferencedFile(self, projectId: int, file: bytes, fileType: str) -> None:
        """
        Save the georeferenced file of a project
        """
        #only accept tiff
        if fileType.find("tiff") == -1:
            raise Exception("Invalid file type")
        #save the georeferenced file
        filePath = await self._FileStorage.saveFile(file, ".tiff")
        #update the project with the file path
        project = await self._StorageHandler.fetchOne(projectId, "project")
        project["georeferencedFilePath"] = filePath
        await self._StorageHandler.update(projectId, project, "project")

    async def getImageFile(self, projectId: int) -> bytes:
        """
        Get the image file of a project
        """
        #get the image file path
        project = await self._StorageHandler.fetchOne(projectId, "project")
        filePath = project["imageFilePath"]
        #get the image file
        file = await self._FileStorage.get(filePath)
        if file is None:
            raise Exception("File not found")
        return file
    
    async def getGeoreferencedFile(self, projectId: int) -> bytes:
        """
        Get the georeferenced file of a project
        """
        #get the georeferenced file path
        project = await self._StorageHandler.fetchOne(projectId, "project")
        filePath = project["georeferencedFilePath"]
        #get the georeferenced file
        file = await self._FileStorage.get(filePath)
        if file is None:
            raise Exception("File not found")
        return file
    
    async def removeImageFile(self, projectId: int) -> None:
        """
        Remove the image file of a project
        """
        #remove the image file
        project = await self._StorageHandler.fetchOne(projectId, "project")
        await self._FileStorage.remove(project["imageFilePath"])
        #update the project with an empty file path
        project["imageFilePath"] = ""
        await self._StorageHandler.update(projectId, project, "project")

    async def removeGeoreferencedFile(self, projectId: int) -> None:
        """
        Remove the georeferenced file of a project
        """
        #remove the georeferenced file
        project = await self._StorageHandler.fetchOne(projectId, "project")
        await self._FileStorage.remove(project["georeferencedFilePath"])
        #update the project with an empty file path
        project["georeferencedFilePath"] = ""
        await self._StorageHandler.update(projectId, project, "project")

    async def updateImageFile(self, projectId: int, file: bytes, fileType: str) -> None:
        """
        Update the image file of a project
        """
        #remove the old image file
        await self.removeImageFile(projectId)
        #save the new image file
        await self.saveImageFile(projectId, file, fileType)
    
    async def updateGeoreferencedFile(self, projectId: int, file: bytes, fileType: str) -> None:
        """
        Update the georeferenced file of a project
        """
        #remove the old georeferenced file
        await self.removeGeoreferencedFile(projectId)
        #save the new georeferenced file
        await self.saveGeoreferencedFile(projectId, file, fileType)
    
    async def getImageFilePath(self, projectId: int) -> str:
        """
        Get the image file path of a project
        """
        project = await self._StorageHandler.fetchOne(projectId, "project")
        return project["imageFilePath"]
    
    async def getGeoreferencedFilePath(self, projectId: int) -> str:
        """
        Get the georeferenced file path of a project
        """
        project = await self._StorageHandler.fetchOne(projectId, "project")
        return project["georeferencedFilePath"]
    
    ### Georeferencing
        
    async def georefPNGImage(self, projectId: int, crs: str = None) -> None:
        """
        Georeference the image of a project
        """
        #get the image file path
        project = await self._StorageHandler.fetchOne(projectId, "project")
        imageFilePath = project["imageFilePath"]
        #get the points of the project
        points = await self._StorageHandler.fetch("point", {"projectId": projectId})
        points = [Point(**point) for point in points]
        #georeference the image
        georeferencedImage = None
        if crs is None:
            georeferencedImage = georef.InitialGeoreferencePngImage(imageFilePath, points)
        else:
            georeferencedImage = georef.InitialGeoreferencePngImage(imageFilePath, points, crs)
        if georeferencedImage is None:
            raise Exception("Image could not be georeferenced")
        #save the georeferenced image
        filePath = await self._FileStorage.save(projectId, georeferencedImage, "georeferenced")
        #update the project with the file path
        project["georeferencedFilePath"] = filePath
        await self._StorageHandler.update(projectId, project, "project")

    async def georefTiffImage(self, projectId: int, crs: str = None) -> None:
        """
        Georeference the image of a project
        """
        #get the image file path
        project = await self._StorageHandler.fetchOne(projectId, "project")
        imageFilePath = project["imageFilePath"]
        #get the points of the project
        points = await self._StorageHandler.fetch("point", {"projectId": projectId})
        points = [Point(**point) for point in points]
        #georeference the image
        georeferencedImage = None
        if crs is None:
            georeferencedImage = georef.reGeoreferencedImageTiff(imageFilePath, points)
        else:
            georeferencedImage = georef.reGeoreferencedImageTiff(imageFilePath, points, crs)
        if georeferencedImage is None:
            raise Exception("Image could not be georeferenced")
        #save the georeferenced image
        filePath = await self._FileStorage.save(projectId, georeferencedImage, "georeferenced")
        #update the project with the file path
        project["georeferencedFilePath"] = filePath
        await self._StorageHandler.update(projectId, project, "project")
