
import api from "./api.js";
import { handleError } from "../../exception/errorHandler.js";

// Add a movie to favourites
export const addFavourite = async (movie) => {
  try {
    const response = await api.post("/favourites", movie);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get all favourite movies
export const getFavourites = async () => {
  try {
    const response = await api.get("/favourites");
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Remove a movie from favourites
export const removeFavourite = async (movieId) => {
  try {
    await api.delete(`/favourites/${movieId}`);
    return true;
  } catch (error) {
    throw new Error(handleError(error));
  }
};