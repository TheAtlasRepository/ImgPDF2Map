from ...utils.models import *
from ...utils.projectHandler import ProjectHandler
from typing import List
import json
import os
#setting up the path to the test image and test points
TestImgName = "galdopiggenturkartp3.png"
TestPointsName = "tpgaldopiggenturkartp3.json"


TestImgRelativePath = os.path.join("./sampleImg", TestImgName)
TestPointsRelativePath = os.path.join("./testpoints", TestPointsName)
AbsolutePath = os.path.abspath(__file__)

testPathImg = os.path.join(os.path.dirname(AbsolutePath), TestImgRelativePath)
testPathPoints = os.path.join(os.path.dirname(AbsolutePath), TestPointsRelativePath)

async def createTestProject(repo: ProjectHandler):
    """Creates a new project with the test image and test points"""
    testImg = testPathImg #path
    testPoints = testPathPoints #path 
    ProjHandler = repo #project handler /access point to work with the project
    
    #creating a new project
    project = Project(name="testproject")
    id = await ProjHandler.createProject(project)

    #Extract the points from the json file and make a list of points
    JsonPoints = json.load(open(testPoints, "r"))
    jsonPoints = JsonPoints["points"]
    Points: List[Point] = []
    for point in jsonPoints:
        #create a new point with the data from the json file as a map
        nPoint = Point(**point)
        nPoint.projectId = id
        Points.append(nPoint)

    #prosessing the image file to bytes
    with open(testImg, "rb") as file:
        inFile = file.read()
        await ProjHandler.saveImageFile(id, file=inFile, fileType="image/png")
    
    return id