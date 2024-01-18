
from fastapi import FastAPI

app = FastAPI()

# Test API that returns Hello World :)

@app.get("/")
def read_root():
    return {"Hello": "World"}