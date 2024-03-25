from img2mapAPI.Img2mapAPI import app
import uvicorn
import dotenv
# Purpose: Entry point for the backend server
# Intended to start the backend server and run the application
def main():
    #load the environment variables
    port=8000
    host="0.0.0.0"
    if dotenv.load_dotenv():
        print("Environment variables loaded")
        #get the port from the environment variables
        port = int(dotenv.get('HOST_PORT'))
        host = dotenv.get('HOST_NAME')

    #run the uvicorn server
    uvicorn.run(app, host=host, port=port)
    

if __name__ == '__main__':
    main()
