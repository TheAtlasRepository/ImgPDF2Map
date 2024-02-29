# This is the project handeler file. It contains the functions to handle the project data.
# The functions in this file are used to create, update, delete and get projects and points.
# The project data is stored in a list in the router file.

# Importing the required modules
from fastapi import APIRouter, HTTPException
from typing import List
from .models import Project, Point
from .storage.localrepository.projects import Projects
