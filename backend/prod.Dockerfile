# Use Python 3.9.13 as the base image
FROM python:3.9.13 as builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
# Set the working directory in the container
WORKDIR /app
# Copy the project files to the working directory
COPY . .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
# Install the project and its dependencies
RUN pip install . -- 

#install poppler-utils
RUN apt-get update && apt-get install -y poppler-utils

# Use Python 3.9.13 as the base image
FROM python:3.9.13-slim as runner

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy the project files to the working directory
COPY --from=builder /app .

# Expose port 8000
EXPOSE 8000

# Command to run the application with uvicorn in production mode
CMD ["uvicorn", "main:app", "--host", "0.0.0.0" , "--port", "8000"]