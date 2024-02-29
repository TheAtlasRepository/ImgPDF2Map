# This is the project handeler file. It contains the functions to handle the project data.
# The functions in this file are used to create, update, delete and get projects and points.
# The project data is stored in a list in the router file.

# Importing the required modules
from fastapi import APIRouter, HTTPException
from typing import List
from img2mapAPI.utils.models import Project, Point
from .storage.filestorage import FileStorage
from .storage.storageHandler import StorageHandler
import datetime

class ProjectHandler:
    _FileStorage: FileStorage = None
    _StorageHandler: StorageHandler = None

    def __init__(self, FileStorage: FileStorage, StorageHandler: StorageHandler):
        self._FileStorage = FileStorage
        self._StorageHandler = StorageHandler
    
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
        return self._StorageHandler.save(project, "project")
    
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
                self._StorageHandler.update(point.id, point, "point")

    async def addPoint(self, projectId: int, point: Point) -> int:
        """
        Add a point to a project
        """
        if self.validatepoints([point]) == False:
            raise Exception("Invalid point")
        #set the projectId of the point
        point.projectId = projectId
        #save the point to storage
        dbid = await self._StorageHandler.save(point, "point")
        return dbid

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
    
    # Function to delete a project
    async def deleteProject(self, projectId: int) -> None:
        """
        Delete a project
        """
        self._StorageHandler.remove(projectId, "project")
    
    # Function to get a project by id
    async def getProject(self, projectId: int) -> Project:
        """
        Get a project by id
        """
        #Convert the data to a project object
        project = self._StorageHandler.fetchOne(projectId, "project")
        project = Project(**project)

        
    
    # Function to get all projects
    async def getProjects(self) -> List[Project]:
        """
        Get all projects
        """
        #Convert the data to a list of project objects
        return [Project(**project) for project in self._StorageHandler.fetch("project")]
    
    async def getProjectPoints(self, projectId: int) -> List[Point]:
        """
        Get all points of a project
        """
        #Convert the data to a list of point objects
        return [Point(**point) for point in self._StorageHandler.fetch("point", {"projectId": projectId})]