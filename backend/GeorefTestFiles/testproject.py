from modules.models import *
from typing import List
import json
import os
#setting up the path to the test image and test points
TestImgName = "testImg1.png"
TestPointsName = "tpImg1.json"


TestImgRelativePath = os.path.join("./sampleImg", TestImgName)
TestPointsRelativePath = os.path.join("./testpoints", TestPointsName)
AbsolutePath = os.path.abspath(__file__)

testPathImg = os.path.join(os.path.dirname(AbsolutePath), TestImgRelativePath)
testPathPoints = os.path.join(os.path.dirname(AbsolutePath), TestPointsRelativePath)


# creates a new project
def createTestProject(repo: object):
    testImg = testPathImg
    testPoints = testPathPoints
    rp = repo
    # create a new project
    project = Project(name="testproject")
    # add the project to the repository
    id = rp.addProject(project)

    #add points to the project from the testpoints.json file
    JsonPoints = json.load(open(testPoints, "r"))
    #create a list of points
    jsonPoints = JsonPoints["points"]
    #add the points to the list
    Pid = 1
    getProject = rp.getProject(id)
    for point in jsonPoints:
        #create a new point with the data from the json file as a map
        nPoint = Point(**point)
        nPoint.id = Pid
        getProject.points.points.append(nPoint)
        Pid += 1
    #update the project
    rp.updateProject(id, getProject)

    #open imageFilePath and write it with sample_640x426.png file
    with open(getProject.imageFilePath, "wb") as file:
        file.write(open(testImg, "rb").read())
    #update the project
    repo.updateProject(id, getProject)
    return id