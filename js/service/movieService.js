
import api from "./api.js";
import { handleError } from "../../exception/errorHandler.js";

// Get all movies
export const getMovies = async () => {
  try {
    const response = await api.get("/movies");
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Add a new movie
export const addMovie = async (movie) => {
  try {
    const response = await api.post("/movies", movie);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Delete a movie
export const deleteMovie = async (movieId) => {
  try {
    const response = await api.delete(`/movies/${movieId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Update a movie
export const updateMovie = async (movieId, updatedMovie) => {
  try {
    const response = await api.put(
      `/movies/${movieId}`,
      updatedMovie
    );

    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
