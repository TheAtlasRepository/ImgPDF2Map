from img2mapAPI.Img2mapAPI import app
import uvicorn
# Purpose: Entry point for the backend server
# Intended to start the backend server and run the application
def main():
    #run the uvicorn server
    uvicorn.run(app, host="0.0.0.0", port=8000)
    

if __name__ == '__main__':
    main()
