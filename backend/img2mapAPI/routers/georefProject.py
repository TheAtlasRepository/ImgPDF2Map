from fastapi import APIRouter, File, UploadFile, HTTPException, BackgroundTasks 
from fastapi.responses import FileResponse, Response
from typing import List
#internal imports:
from ..utils.models.project import Project
from ..utils.models.point import Point
from ..utils.projectHandler import ProjectHandler
from ..utils.storage.files.fileStorage import FileStorage
from ..utils.storage.files.localFileStorage import LocalFileStorage
from ..utils.storage.data.storageHandler import StorageHandler
from ..utils.storage.data.localStorage import LocalStorage
from ..devOnly.georefTestFiles.testproject import createTestProject as cts #test function
from ..devOnly.localrepository.repository import Repository

router = APIRouter(
    prefix="/project",
    tags=["Georeferencing Project"],
)

#TODO: Add a dependency class to handle errors and return the correct status code
_repository: Repository = Repository()
_StorageHandler: StorageHandler = LocalStorage(_repository) 
_Filestorage: FileStorage = LocalFileStorage()

_projectHandler = ProjectHandler(_Filestorage, _StorageHandler)

@router.post("/")
async def createProject(project: Project):
    """
    Create a new project and return the id of the project
    - only the name is required, the rest of the attributes are optional
    """
    try:
        id = await _projectHandler.createProject(project)
        return {"id": id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'Project could not be created: {str(e.with_traceback(None))}, {e.args}')

@router.put("/{projectId}")
async def updateProject(projectId: int, project: Project):
    """ Update the project details and return the id of the project """
    try:
        if await _projectHandler.updateProject(projectId, project): return {"ProjectID": projectId}
        else: raise HTTPException(status_code=404, detail="Project not found")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{projectId}")
async def deleteProject(projectId: int, backgroundTasks: BackgroundTasks):
    """ Delete a project and return a message if the project was deleted"""
    try:
        backgroundTasks.add_task(_projectHandler.deleteProject, projectId)
        backgroundTasks.is_async = True
        return Response(content="Deletion request of project accepted", status_code=202, media_type="text/plain", background=backgroundTasks)
    except Exception as e:
        if e.status_code == 500:
            raise HTTPException(status_code=500, detail=str(e))
        pass

@router.get("/{projectId}")
async def getProject(projectId: int):
    """ Get a project by id """
    try:
        project = await _projectHandler.getProject(projectId)
        return project
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{projectId}/point")
async def addPoint(projectId: int, innpoint: Point):
    """ Add a point to a project and return the id of the point"""
    try:
        (PointID, Dbid) = await _projectHandler.addPoint(projectId, innpoint)
        return {"Project":{"id": projectId},"Point":{"id": Dbid,"inProjectId": PointID}}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{projectId}/point/{pointId}")
async def updatePoint(projectId: int, pointId: int, point: Point):
    """ Update a point in a project and returns ids of the project and the point to show that the point was updated"""
    try:
        if await _projectHandler.updatePoint(projectId, pointId, point):
            return {"Project":{"id": projectId},"Point":{"id": pointId}}
        else:
            raise HTTPException(status_code=404, detail="Point not found")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{projectId}/point/{pointId}")
async def deletePoint(projectId: int, pointId: int, backgroundTasks: BackgroundTasks):
    """ Delete a point from a project returns action status"""
    try:
        backgroundTasks.add_task(_projectHandler.removePoint, projectId, pointId)
        return Response(content="Deletion request of point accepted", status_code=202, media_type="text/plain", background=backgroundTasks)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{projectId}/point")
async def getPoints(projectId: int):
    """ Get all points of a project"""
    try:
        points: List[Point] = await _projectHandler.getProjectPoints(projectId)
        return points
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{projectId}/point/{pointId}")
async def getPoint(projectId: int, pointId: int):
    """ Get a point in a project by id's"""
    try:
        point = await _projectHandler.getPoint(projectId, pointId)
        return point
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{projectId}/image")
async def uploadImage(projectId: int, file: UploadFile = File(...)):
    """ Upload an image to a project"""
    try:
        tempFile = await file.read()
        await _projectHandler.saveImageFile(projectId, tempFile, file.content_type)
        return {"status": "Image uploaded"}
    except Exception as e:
        #check if e has a status code attribute
        if hasattr(e, "status_code"):
            raise HTTPException(status_code=e.status_code, detail=str(e))
        else:
            raise HTTPException(status_code=500, detail=str(e))

@router.get("/{projectId}/image")
async def getImage(projectId: int):
    """ Get the image of a project by id, returns the image file if found"""
    try:
        imagepath = await _projectHandler.getImageFilePath(projectId)
        mediaType = "image/png"
        return FileResponse(imagepath, media_type=mediaType)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

#TODO: fix the updating of the project with the new image
@router.get("/{projectId}/georef/initial")
async def InitalgeorefImage(projectId: int, crs: str = None):
    """ Georeference the image of a project by id, returns the georeferenced image file if found"""
    #try:
    await _projectHandler.georefPNGImage(projectId, crs)
    imagepath = await _projectHandler.getGeoreferencedFilePath(projectId)
    return FileResponse(imagepath, media_type="image/tiff", filename="georeferenced.tiff")
    #except Exception as e:
    #    raise HTTPException(status_code=404, detail=str(e))

#TODO: fix updating the project with the new georeferenced image
@router.get("/{projectId}/georef/referenced")
async def adjustGeoref(projectId: int):
    """ re-georeference the image of a project by id, returns the georeferenced image file if found"""
    try:
        await _projectHandler.georefTiffImage(projectId)
        imagepath = await _projectHandler.getGeoreferencedFilePath(projectId)
        return FileResponse(imagepath, media_type="image/tiff", filename="georeferenced.tiff")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/test", tags=["test"])
async def createTestProject():
    """ Create a test project and return the id of the project 
    """
    try:
        id = await cts(_projectHandler)
        return {"status": "Test project created", "id": id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

    