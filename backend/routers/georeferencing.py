from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from modules.georeferenser import georeferencer
from modules.models import *
from typing import List
#Router handles all requests to the georeferencing API
router = APIRouter()


#GeorefProject path: /georef/project
#route to create and or get georef a project id
@router.post("/")
async def georefProject(project: Project):
    #todo: create a new project and return the id
    #tempreturn not implemented
    return {"id": 1}

#route update project details
@router.put("/{projectId}")
async def updateProject(projectId: int):
    #todo: find project by id and update it
    #tempreturn not implemented
    return {"id": projectId}

#route to delete a project
@router.delete("/{projectId}")
async def deleteProject(projectId: int):
    #todo: find project by id and delete it
    #tempreturn not implemented
    return {"id": projectId}

#route to get a project by id
@router.get("/{projectId}")
async def getProject(projectId: int):
    #todo: find project by id and return it
    #tempreturn not implemented
    return {"id": projectId}


#route to add a point to a project
@router.post("/{projectId}/point")
async def addPoint(projectId: int, point: Point):
    #todo: find project by id and add point to it's list of points
    #tempreturn not implemented
    return {"id": projectId}

#route to update a point
@router.put("/{projectId}/point/{pointId}")
async def updatePoint(projectId: int, pointId: int, point: Point):
    #todo: find project by id and update point by id
    #tempreturn not implemented
    return {"id": projectId}

#route to delete a point
@router.delete("/{projectId}/point/{pointId}")
async def deletePoint(projectId: int, pointId: int):
    #todo: find project by id and delete point by id
    #tempreturn not implemented
    return {"id": projectId}

#route to get all points of a project
@router.get("/{projectId}/point")
async def getPoints(projectId: int):
    #todo: find project by id and return all points
    #tempreturn not implemented
    return {"id": projectId}

#route to get a point by id
@router.get("/{projectId}/point/{pointId}")
async def getPoint(projectId: int, pointId: int):
    #todo: find project by id and return point by id
    #tempreturn not implemented
    return {"id": projectId}

#route to upload an image
@router.post("/{projectId}/image")
async def uploadImage(projectId: int, image: UploadFile = File(...)):
    #todo: find project by id and upload image, give the path to project, return success
    #tempreturn not implemented
    return {"id": projectId}
