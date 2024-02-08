#Backend application initialization
#path: backend/__init__.py
#package name: backend

#import all from routers
from routers import *

#Package name is backend
#This file is the entry point for the backend application

from fastapi import FastAPI, APIRouter
from routers import *
from localrepository import *
from modules import *

