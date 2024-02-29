const BASE_URL = "http://localhost:8000";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Something went wrong!");
  }
  return response.json();
};

export const addProject = async (name: string) => {
  const response = await fetch(`${BASE_URL}/project/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  });

  return handleResponse(response);
};

export const addMarkerPair = async (
  projectId: number,
  latitude: number,
  longitude: number,
  x: number,
  y: number
) => {
  const response = await fetch(`${BASE_URL}/project/${projectId}/point`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      latitude,
      longitude,
      x,
      y,
      error: null,
      id: null,
      name: "",
    }),
  });

  return handleResponse(response);
};
