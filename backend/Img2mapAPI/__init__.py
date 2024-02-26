from . import Img2mapAPI
from . import Routers
from . import Models
from . import Utils
import Routers

#This is the MainPackage __init__.py file
#This file is the entry point for the MainPackage application
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from Routers import georeferencing ,converters



