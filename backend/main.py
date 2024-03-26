import uvicorn
import dotenv
import argparse
# Purpose: Entry point for the backend server
# Intended to start the backend server and run the application
def main():
    #load the environment variables
    port=8000
    host="0.0.0.0"
    parser = argparse.ArgumentParser()
    parser.add_argument("-p",'--port', type=int, help='Port to run the server on')
    args = parser.parse_args()
    if args.port:
        port = args.port
    else:
        if dotenv.load_dotenv():
            print("Environment variables loaded")
            #get the port from the environment variables
            port = dotenv.get_key('./.env',key_to_get='HOST_PORT')
            try:
                port = int(port)
            except:
                port = 8000
    import img2mapAPI.Img2mapAPI as Img2mapAPI
    #run the uvicorn server
    config = uvicorn.Config(Img2mapAPI.app, host=host, port=port, log_level="info")
    server = uvicorn.Server(config)
    server.run()
    

if __name__ == '__main__':
    main()
