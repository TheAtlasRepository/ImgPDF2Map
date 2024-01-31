## Setting up Miniconda Environment

1. **Install Miniconda:**

   - Download and install Miniconda from [Miniconda website](https://docs.conda.io/en/latest/miniconda.html).

2. **Create a Conda Environment:**

   - Need to be in the directory you want to set the project up in!

   ```bash
    conda create --name YOUR_ENV_NAME

    conda activate YOUR_ENV_NAME

    conda install yarn

    yarn create next-app frontend
        - Name it something usefull like front
        - Press enter all over

    conda install pip

    yarn add next

   ```

3. **To Run Frontend**
   cd frontend

   npm add @mapbox/mapbox-gl-geocoder

   npx v0@latest init

   yarn dev

4. **To run Backend**
   cd backend

   pip install -r requirements.txt

   uvicorn main:app --reload
