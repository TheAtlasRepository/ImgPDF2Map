from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from typing import List

#internal imports
from ..utils.models.project import Project
from ..utils.models.pointList import PointList
from ..utils.models.point import Point
from ..devOnly.localrepository.projects import Projects
from ..utils.core import georefHelper as georef
from ..devOnly.GeorefTestFiles.testproject import createTestProject as cts

router = APIRouter(
    prefix="/project",
    tags=["Georeferencing Project"],
)

#TODO: Add a dependency class to handle errors and return the correct status code

#adding the singleton repository to the router to be able to access the projects
router.projects = Projects()
Repo = router.projects

#function to find the highest id of a list of points
def find_higest_id(points: List[Point]):
    highest = 0
    for point in points:
        if point.id > highest:
            highest = point.id
    return highest


#GeorefProject path: /georef/project
#route to create and or get georef a project id
@router.post("/")
async def createProject(project: Project):
    try:
        id = Repo.addProject(project)
        #get the created project and return it's id
        return {"id": id}
    except:
        raise HTTPException(status_code=400, detail="Project could not be created")

#route update project details
@router.put("/{projectId}")
async def updateProject(projectId: int):
    #try to find the project by id and update it
    try:
        project = Repo.getProject(projectId)
        Repo.updateProject(projectId, project)
        return {"id": projectId}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


#route to delete a project
@router.delete("/{projectId}")
async def deleteProject(projectId: int):
    #try to find the project by id and delete it
    try:
        #find the project by id and remove it
        Repo.removeProject(projectId)
        return {"ProjectID": projectId}
    except Exception as e:
        if e.status_code == 500:
            raise HTTPException(status_code=500, detail=str(e))
        else:
            raise HTTPException(status_code=404, detail=str(e))
    

#route to get a project by id
@router.get("/{projectId}")
async def getProject(projectId: int):
    #try to find the project by id and return it
    try:
        project = Repo.getProject(projectId)
        return project
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


#route to add a point to a project
@router.post("/{projectId}/point")
async def addPoint(projectId: int, point: Point):
    #try to find the project by id and add a point to it
    try:
        project = Repo.getProject(projectId)
        if project.points is None:
            #check if the points attribute is None and create a new pointList
            project.points = PointList()
            #set the id of the point
            point.id = 1
        else:
            #set the id of the point
            point.id = find_higest_id(project.points.points) + 1
            project.points.points.append(point)
        Repo.updateProject(projectId, project)
        return {"Project":{{"id": projectId}},"Point":{{"id": point.id}}}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))





#route to update a point
@router.put("/{projectId}/point/{pointId}")
async def updatePoint(projectId: int, pointId: int, point: Point):
    #try to find the project by id and update a point by id
    try:
        project = Repo.getProject(projectId)
        #find the point by id and update it
        for i in range(len(project.points.points)):
            if project.points.points[i].id == pointId:
                #set the id of the point
                point.id = pointId
                project.points.points[i] = point
                Repo.updateProject(projectId, project)
                return {"Project":{{"id": projectId}},"Point":{{"id": point.id}}}
        raise Exception("Point not found")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

#route to delete a point
@router.delete("/{projectId}/point/{pointId}")
async def deletePoint(projectId: int, pointId: int):
    #try to find the project by id and delete a point by id
    try:
        project = Repo.getProject(projectId)
        for i in range(len(project.points.points)):
            if project.points.points[i].id == pointId:
                project.points.points.pop(i)
                Repo.updateProject(projectId, project)
                return {"Project":{{"id": projectId}},"Point":{{"id": pointId}}}
        raise Exception("Point not found")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

#route to get all points of a project
@router.get("/{projectId}/point")
async def getPoints(projectId: int):
    #try to find the project by id and return all points
    try:
        project = Repo.getProject(projectId)
        if project.points is None:
            return []
        return project.points
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

#route to get a point by id
@router.get("/{projectId}/point/{pointId}")
async def getPoint(projectId: int, pointId: int):
    #try to find the project by id and return a point by id
    try:
        project = Repo.getProject(projectId)
        for point in project.points.points:
            if point.id == pointId:
                return point
        raise Exception("Point not found")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

#route to upload an image /specify only accept png
@router.post("/{projectId}/image")
async def uploadImage(projectId: int, file: UploadFile = File(...)):
    #try to find the project by id and upload an image
    try:
        #check if the file is a png
        if file.content_type != "image/png":
            raise HTTPException(status_code=415, detail="Only png files are accepted")
        project = Repo.getProject(projectId)
        #save the image to the project
        with open(project.imageFilePath, "wb") as buffer:
            buffer.write(file.file.read())
        return {"Project":{"ProjectID": projectId, "Image": file.filename}}
    except Exception as e:
        if e.status_code == 415:
            raise e
        else:
            raise HTTPException(status_code=404, detail=str(e))

#route to get the image of a project
@router.get("/{projectId}/image")
async def getImage(projectId: int):
    #try to find the project by id and return the image
    try:
        project = Repo.getProject(projectId)
        #get the temporary file path of the image
        imageFilePath = project.imageFilePath
        #find the media type of the image
        mediaType = "image/png"
        return FileResponse(imageFilePath, media_type=mediaType)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


#route to georeference the image of a project
@router.get("/{projectId}/georef")
async def georefImage(projectId: int, crs: str = None):

    #try to find the project by id and georeference the image
    try:
        project = Repo.getProject(projectId)
        #get the temporary file path of the image
        imageFilePath = project.imageFilePath
        #get the pointsList of the project
        points = project.points
        #georeference the image
        georeferencedImage = None
        if crs is None:
            georeferencedImage = georef.georeferencer(imageFilePath, points)
        else:
            georeferencedImage = georef.georeferencer(imageFilePath, points, crs)
        if georeferencedImage is None:
            raise Exception("Image could not be georeferenced")
        #open the projetcs georeferencedFilePath and write the georeferenced image to it
        with open(project.georeferencedFilePath, "wb") as file:
            file.write(open(georeferencedImage, "rb").read())
            #remove the temporary file
            georef.removeFile(georeferencedImage)
        return FileResponse(project.georeferencedFilePath, media_type="image/tiff")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

#route 
@router.get("/{projectId}/georef/tiff")
async def adjustGeoref(projectId: int):
    #try to find the project by id and adjust the georeferenced image
    try:
        project = Repo.getProject(projectId)
        #get the temporary file path of the image
        imageFilePath = project.georeferencedFilePath
        #get the pointsList of the project
        points = project.points
        #georeference the image
        georeferencedImage = georef.adjustGeoreferencedImage(imageFilePath, points)
        if georeferencedImage is None:
            raise Exception("Image could not be georeferenced")
        #open the projetcs georeferencedFilePath and overwrite with the adjusted georeferenced image
        with open(project.georeferencedFilePath, "wb") as file:
            file.write(open(georeferencedImage, "rb").read())
            #remove the temporary file
            georef.removeFile(georeferencedImage)
        return FileResponse(project.georeferencedFilePath, media_type="image/tiff")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


#route to create a test project
@router.post("/test", tags=["test"])
async def createTestProject():
    #create a test project
    try:
        rp = Repo
        #create a test project
        id = cts(rp)
        return {"status": "Test project created", "id": id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))