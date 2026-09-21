
export const handleError = (error) => {
  console.error("Error:", error);

  // Server is not running
  if (!error.response) {
    return "Unable to connect to the server. Please start JSON Server.";
  }

  const status = error.response.status;

  switch (status) {
    case 400:
      return "Invalid request. Please check your data.";

    case 404:
      return "The requested movie was not found.";

    case 500:
      return "Server error. Please try again later.";

    default:
      return "Something went wrong. Please try again.";
  }
};