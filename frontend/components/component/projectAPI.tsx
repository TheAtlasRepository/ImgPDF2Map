import axios, { AxiosResponse, AxiosError } from "axios";

interface ProjectResponse {
  id: number;
  name: string;
}

interface MarkerPairResponse {
  id: number;
  lat: number;
  lng: number;
  col: number;
  row: number;
  name: string;
}

interface ErrorResponse {
  detail: string;
}

const BASE_URL = "http://localhost:8000";

let hasMadeProjectApiCall = false;

// A helper function to extract error message
function getErrorMessage(error: AxiosError<ErrorResponse>): string {
  return error.response?.data.detail || "Something went wrong!";
}

export const addProject = async (name: string): Promise<ProjectResponse> => {
  if (hasMadeProjectApiCall) return Promise.reject("API call already made");
  hasMadeProjectApiCall = true;
  try {
    const response: AxiosResponse<ProjectResponse> = await axios.post(
      `${BASE_URL}/project/`,
      { name }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError<ErrorResponse>));
  }
};

export const addMarkerPair = async (
  projectId: number,
  lat: number,
  lng: number,
  col: number,
  row: number
): Promise<MarkerPairResponse> => {
  try {
    const response: AxiosResponse<MarkerPairResponse> = await axios.post(
      `${BASE_URL}/project/${projectId}/point`,
      {
        lat,
        lng,
        col,
        row,
        name: "",
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError<ErrorResponse>));
  } finally {
    console.log("Marker pair added");
  }
};

// uploadImage
export const uploadImage = async (
  projectId: number,
  formData: FormData
): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/project/${projectId}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError<ErrorResponse>));
  } finally {
    console.log("Image uploaded");
  }
};

// initalGeorefimage /project/{projectId}/georef/initial
export const initalGeorefimage = async (projectId: number): Promise<void> => {
  try {
    // Add image capture logic here later
    await axios.get(`${BASE_URL}/project/${projectId}/georef/initial`);
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError<ErrorResponse>));
  } finally {
    console.log("Initial georefimage done");
  }
};
