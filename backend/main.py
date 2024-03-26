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
        port = dotenv.get_key('./.env',key_to_get='HOST_PORT')
        host = dotenv.get_key('./.env',key_to_get='HOST_NAME')
        try:
            port = int(port)
        except:
            port = 8000
    import img2mapAPI.Img2mapAPI as Img2mapAPI
    #run the uvicorn server
    config = uvicorn.Config(Img2mapAPI.app, host=host, port=port, log_level="info", env_file="./.env")
    server = uvicorn.Server(config)
    server.run()
    

if __name__ == '__main__':
    main()
