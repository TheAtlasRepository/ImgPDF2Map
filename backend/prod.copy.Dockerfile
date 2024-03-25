# Description: Dockerfile for production environment

#stage 1 create requirements.txt from setup.py and install dependencies
FROM  python:3.9.13 as deps
WORKDIR /app
COPY ./setup.py ./setup.py
RUN pip install --upgrade pip

#generate requirements.txt
RUN pip install pip-tools
RUN pip-compile --output-file requirements.txt setup.py

#stage 2 build the image
FROM python:3.9.13 as builder

#set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

#set working directory
WORKDIR /code

#copy requirements.txt
COPY --from=deps /app/requirements.txt /code/requirements.txt
COPY . .


#stage 3 run the image






