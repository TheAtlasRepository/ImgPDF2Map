# Image/PDF 2 Map
## Setting up project
1. **Install Miniconda:**
   Download and install Miniconda from [Miniconda website](https://docs.conda.io/en/latest/miniconda.html).

2. **Create a Conda Environment:**
   Need to be in the directory you want to set the project up in!

   ```bash
    conda create --name YOUR_ENV_NAME

    conda activate YOUR_ENV_NAME

    conda install yarn

    conda install pip

    conda install -c conda-forge poppler
   ```

3. **To run Backend**
   ```bash
   cd backend

   pip install -r requirements.txt

   uvicorn main:app --reload
   ```

4. **Set up Mapbox API key**
   In directory "frontend", create a file named `.env.local`.
   Add and modify the following line:
   ```bash
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=*your Mapbox API key*
   ```

5. **To Run Frontend**
   ```bash
   cd frontend

   yarn install

   yarn dev
   ```
