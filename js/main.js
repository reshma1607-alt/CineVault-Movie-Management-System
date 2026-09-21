import {
  getMovies,
  addMovie,
  deleteMovie,
  updateMovie
} from "./service/movieService.js";
import { formatPrice } from "./utils.js";
import {
  addFavourite,
  getFavourites,
  removeFavourite
} from "./service/favouriteService.js";
const showToast = (message) => {
  const toastContainer = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};
const movieContainer = document.getElementById("movieContainer");
const searchInput = document.getElementById("searchInput");
const sortMovies = document.getElementById("sortMovies");
const languageButtons = document.querySelectorAll(
  ".language-btn[data-language]"
);

const recentMoviesBtn = document.getElementById("recentMoviesBtn");
const favouritesBtn = document.getElementById("favouritesBtn");
const addMovieBtn = document.getElementById("addMovieBtn");
const addMovieModal = document.getElementById("addMovieModal");
const closeAddMovie = document.getElementById("closeAddMovie");
const addMovieForm = document.getElementById("addMovieForm");
const movieModal = document.getElementById("movieModal");
const movieDetails = document.getElementById("movieDetails");
const closeModal = document.getElementById("closeModal");
// Edit Movie Elements
const editMovieModal = document.getElementById("editMovieModal");
const closeEditMovie = document.getElementById("closeEditMovie");
const editMovieForm = document.getElementById("editMovieForm");

let selectedMovieId = null;

let allMovies = [];
let selectedLanguage = "All";
let isRecentMode = false;
let isFavouritesMode = false;
// =========================================
// FORM VALIDATION
// =========================================

const validateMovieData = (movie) => {
  const currentYear = new Date().getFullYear();

  if (!movie.title.trim()) {
    alert("Please enter a movie title.");
    return false;
  }

  if (!movie.genre.trim()) {
    alert("Please enter a movie genre.");
    return false;
  }

  if (!movie.language) {
    alert("Please select a language.");
    return false;
  }

  if (
    isNaN(movie.rating) ||
    movie.rating < 0 ||
    movie.rating > 10
  ) {
    alert("Rating must be between 0 and 10.");
    return false;
  }

  if (
    isNaN(movie.releaseYear) ||
    movie.releaseYear < 1888 ||
    movie.releaseYear > currentYear + 2
  ) {
    alert("Please enter a valid release year.");
    return false;
  }

  if (
    isNaN(movie.ticketPrice) ||
    movie.ticketPrice < 0
  ) {
    alert("Ticket price cannot be negative.");
    return false;
  }

  if (!movie.poster.trim()) {
    alert("Please enter a poster URL.");
    return false;
  }

  try {
  new URL(movie.poster, window.location.origin);
} catch (error) {
  alert("Please enter a valid poster URL.");
  return false;
}

  if (!movie.description.trim()) {
    alert("Please enter a movie description.");
    return false;
  }

  return true;
};
// Open Edit Movie Modal
const openEditMovieModal = (movieId) => {
  const movie = allMovies.find(
    (movie) => String(movie.id) === String(movieId)
  );

  if (!movie) {
    alert("Movie not found!");
    return;
  }

  selectedMovieId = movie.id;

  document.getElementById("editMovieTitle").value = movie.title;
  document.getElementById("editMovieGenre").value = movie.genre;
  document.getElementById("editMovieLanguage").value = movie.language;
  document.getElementById("editMovieRating").value = movie.rating;
  document.getElementById("editMovieYear").value = movie.releaseYear;
  document.getElementById("editMoviePrice").value = movie.ticketPrice;
  document.getElementById("editMoviePoster").value = movie.poster;
  document.getElementById("editMovieDescription").value = movie.description;

  editMovieModal.style.display = "flex";
};

// Display movies
const displayMovies = (movies) => {
  movieContainer.innerHTML = "";

  if (movies.length === 0) {
  movieContainer.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">🎬</div>
      <h2>No Movies Found</h2>
      <p>Try selecting another language or searching for a different movie.</p>
    </div>
  `;

  return;
}

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");

    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}">

      <h3>${movie.title}</h3>

      <p>Genre: ${movie.genre}</p>

      <p>Language: ${movie.language}</p>

      <p>Rating: ⭐ ${movie.rating}</p>

      <p>Release Year: ${movie.releaseYear}</p>

      <p>Ticket Price: ${formatPrice(movie.ticketPrice)}</p>

      <p>${movie.description}</p>

<button class="view-details-btn" data-id="${movie.id}">
  View Details
</button>
<button class="edit-movie-btn" data-id="${movie.id}">
  ✏️ Edit Movie
</button>
<button class="delete-movie-btn" data-id="${movie.id}">
  🗑️ Delete Movie
</button>

${
  isFavouritesMode
    ? `<button class="remove-favourite-btn" data-id="${movie.id}">
         🗑️ Remove from Favourites
       </button>`
    : ""
}
    `;

    movieContainer.appendChild(movieCard);
  });
};

const openMovieDetails = (movieId) => {
  const movie = allMovies.find(
    (item) => String(item.id) === String(movieId)
  );

  if (!movie) {
    return;
  }

  movieDetails.innerHTML = `
    <img src="${movie.poster}" alt="${movie.title}">

    <h2>${movie.title}</h2>

    <p><strong>Genre:</strong> ${movie.genre}</p>

    <p><strong>Language:</strong> ${movie.language}</p>

    <p><strong>Rating:</strong> ⭐ ${movie.rating}</p>

    <p><strong>Release Year:</strong> ${movie.releaseYear}</p>

    <p><strong>Ticket Price:</strong> ${formatPrice(movie.ticketPrice)}</p>

    <p><strong>Duration:</strong> ${movie.duration || "Not available"}</p>

    <p><strong>Description:</strong> ${movie.description}</p>
    <button class="favourite-btn" data-id="${movie.id}">
  ❤️ Add to Favourites
</button>
  `;

  movieModal.style.display = "flex";
};

movieContainer.addEventListener("click", async (event) => {
  const detailsButton = event.target.closest(".view-details-btn");
  const removeButton = event.target.closest(".remove-favourite-btn");
  const editButton = event.target.closest(".edit-movie-btn");
  const deleteButton = event.target.closest(".delete-movie-btn");
// Edit movie
if (editButton) {
  const movieId = editButton.dataset.id;

  openEditMovieModal(movieId);

  return;
}

if (deleteButton) {
  const movieId = deleteButton.dataset.id;

  const confirmDelete = confirm(
    "Are you sure you want to delete this movie?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const confirmDelete = confirm(
  "Are you sure you want to delete this movie?"
);

if (!confirmDelete) {
  return;
}
    await deleteMovie(movieId);
alert("Movie deleted successfully!");

allMovies = await getMovies();
filterMovies();
await updateDashboard();


  } catch (error) {
    console.error("Failed to delete movie:", error.message);
    alert("Unable to delete movie.");
  }

  return;
}

  if (removeButton) {
    const movieId = removeButton.dataset.id;
    try {
      await removeFavourite(movieId);

      alert("Movie removed from favourites!");

      const favourites = await getFavourites();
      displayMovies(favourites);
    } catch (error) {
      console.error("Failed to remove favourite:", error.message);
      alert("Unable to remove movie from favourites.");
    }

    return;
  }
  

  if (detailsButton) {
    const movieId = detailsButton.dataset.id;

    openMovieDetails(movieId);
  }
});
// Add movie to favourites
movieDetails.addEventListener("click", async (event) => {
  const favouriteButton = event.target.closest(".favourite-btn");

  if (!favouriteButton) {
    return;
  }

  const movieId = favouriteButton.dataset.id;

  const movie = allMovies.find(
    (item) => String(item.id) === String(movieId)
  );

  if (!movie) {
    return;
  }

  try {
    await addFavourite(movie);
    await updateDashboard();

    favouriteButton.textContent = "❤️ Added to Favourites";
    favouriteButton.disabled = true;

    alert(`${movie.title} added to favourites!`);
  } catch (error) {
    console.error("Failed to add favourite:", error.message);
    alert("Unable to add movie to favourites.");
  }
});

// Close modal using the close button
closeModal.addEventListener("click", () => {
  movieModal.style.display = "none";
});

// Close modal when clicking outside the popup
movieModal.addEventListener("click", (event) => {
  if (event.target === movieModal) {
    movieModal.style.display = "none";
  }
});

// Filter and sort movies
const filterMovies = () => {
  const searchText =
    searchInput.value.toLowerCase().trim();

  let filteredMovies = allMovies.filter((movie) => {
    const title = String(movie.title || "").toLowerCase();
    const genre = String(movie.genre || "").toLowerCase();

    const matchesLanguage =
      selectedLanguage === "All" ||
      movie.language === selectedLanguage;

    const matchesSearch =
      title.includes(searchText) ||
      genre.includes(searchText);

    return matchesLanguage && matchesSearch;
  });

  // Recently released movies
  if (isRecentMode) {
    filteredMovies.sort((a, b) => {
      return Number(b.releaseYear) - Number(a.releaseYear);
    });
  }

  // Selected sorting option
  switch (sortMovies.value) {
    case "ratingHigh":
      filteredMovies.sort((a, b) => {
        return Number(b.rating) - Number(a.rating);
      });
      break;

    case "ratingLow":
      filteredMovies.sort((a, b) => {
        return Number(a.rating) - Number(b.rating);
      });
      break;

    case "yearNew":
      filteredMovies.sort((a, b) => {
        return Number(b.releaseYear) - Number(a.releaseYear);
      });
      break;

    case "yearOld":
      filteredMovies.sort((a, b) => {
        return Number(a.releaseYear) - Number(b.releaseYear);
      });
      break;

    case "priceLow":
      filteredMovies.sort((a, b) => {
        return Number(a.ticketPrice) - Number(b.ticketPrice)
      });
      break;

    case "priceHigh":
      filteredMovies.sort((a, b) => {
        return Number(b.ticketPrice) - Number(a.ticketPrice)
      });
      break;
  }

  displayMovies(filteredMovies);
};

// Language button click
languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedLanguage = button.dataset.language;
    isRecentMode = false;
    isFavouritesMode = false;

    languageButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    recentMoviesBtn.classList.remove("active");

    filterMovies();
  });
});

// Recently Released button
recentMoviesBtn.addEventListener("click", () => {
  isRecentMode = true;
  isFavouritesMode = false;

  recentMoviesBtn.classList.add("active");

  languageButtons.forEach((btn) => {
    btn.classList.remove("active");
  });

  filterMovies();
});
// View Favourites button
favouritesBtn.addEventListener("click", async () => {
  try {
    const favourites = await getFavourites();
    isFavouritesMode = true;

    displayMovies(favourites);

    languageButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    recentMoviesBtn.classList.remove("active");

  } catch (error) {
    console.error("Failed to load favourites:", error.message);
  }
});

// Search input
searchInput.addEventListener("input", () => {
  filterMovies();
});
// Sort movies when dropdown changes
sortMovies.addEventListener("change", () => {
  filterMovies();
});
// Load movies
const loadMovies = async () => {
  try {
    movieContainer.innerHTML = `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <h2>Loading CineVault...</h2>
        <p>Preparing your movie collection 🎬</p>
      </div>
    `;

    await new Promise(resolve => setTimeout(resolve, 1000));

allMovies = await getMovies();

    displayMovies(allMovies);
    await updateDashboard();

  } catch (error) {
    console.error("Failed to load movies:", error.message);

    movieContainer.innerHTML = `
      <div class="loading-state">
        <h2>Unable to load movies</h2>
        <p>Please check whether JSON Server is running.</p>
      </div>
    `;
  }
};

loadMovies();
// Open Add Movie Modal
addMovieBtn.addEventListener("click", () => {
  addMovieModal.style.display = "flex";
});

/* ============================= */
/* Add Movie Form Submit */
/* ============================= */

addMovieForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newMovie = {
    title: document.getElementById("movieTitle").value,
    genre: document.getElementById("movieGenre").value,
    language: document.getElementById("movieLanguage").value,
    rating: Number(document.getElementById("movieRating").value),
    releaseYear: Number(document.getElementById("movieYear").value),
    ticketPrice: Number(document.getElementById("moviePrice").value),
    poster: document.getElementById("moviePoster").value,
    description: document.getElementById("movieDescription").value,
    duration: "2h"
  };
  // Validate movie data
if (!validateMovieData(newMovie)) {
  return;
}

  try {
    await addMovie(newMovie);

    alert("Movie added successfully!");

    addMovieForm.reset();
    addMovieModal.style.display = "none";

    allMovies = await getMovies();
    filterMovies();
    await updateDashboard();


  } catch (error) {
    console.error("Failed to add movie:", error.message);
    alert("Unable to add movie.");
  }
});


/* ============================= */
/* Update Movie Form Submit */
/* ============================= */

editMovieForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!selectedMovieId) {
    alert("No movie selected!");
    return;
  }

  const existingMovie = allMovies.find(
    (movie) => String(movie.id) === String(selectedMovieId)
  );

  const updatedMovie = {
    id: selectedMovieId,
    title: document.getElementById("editMovieTitle").value,
    genre: document.getElementById("editMovieGenre").value,
    language: document.getElementById("editMovieLanguage").value,
    rating: Number(document.getElementById("editMovieRating").value),
    releaseYear: Number(document.getElementById("editMovieYear").value),
    ticketPrice: Number(document.getElementById("editMoviePrice").value),
    poster: document.getElementById("editMoviePoster").value,
    description: document.getElementById("editMovieDescription").value,
    duration: existingMovie?.duration || "2h"
  };
  // Validate updated movie data
if (!validateMovieData(updatedMovie)) {
  return;
}

  try {
    await updateMovie(selectedMovieId, updatedMovie);

    alert("Movie updated successfully!");

    editMovieForm.reset();
    editMovieModal.style.display = "none";

    allMovies = await getMovies();
    filterMovies();
    await updateDashboard();

    selectedMovieId = null;

  } catch (error) {
    console.error("Failed to update movie:", error.message);
    alert("Unable to update movie.");
  }
});


/* ============================= */
/* Close Add Movie Modal */
/* ============================= */

closeAddMovie.addEventListener("click", () => {
  addMovieModal.style.display = "none";
});

addMovieModal.addEventListener("click", (event) => {
  if (event.target === addMovieModal) {
    addMovieModal.style.display = "none";
  }
});


/* ============================= */
/* Close Edit Movie Modal */
/* ============================= */

closeEditMovie.addEventListener("click", () => {
  editMovieModal.style.display = "none";
});

editMovieModal.addEventListener("click", (event) => {
  if (event.target === editMovieModal) {
    editMovieModal.style.display = "none";
  }
});

// =========================================
// DASHBOARD STATISTICS
// =========================================

const updateDashboard = async () => {
  const totalMoviesElement =
    document.getElementById("totalMovies");

  const averageRatingElement =
    document.getElementById("averageRating");

  const totalFavouritesElement =
    document.getElementById("totalFavourites");

  const languageCountElement =
    document.getElementById("languageCount");

  const languageStatsElement =
    document.getElementById("languageStats");

  if (!totalMoviesElement) {
    return;
  }

  // Total movies
  const totalMovies = allMovies.length;

  // Average rating
  const totalRating = allMovies.reduce((sum, movie) => {
    return sum + Number(movie.rating || 0);
  }, 0);

  const averageRating =
    totalMovies > 0 ? totalRating / totalMovies : 0;

  // Count unique languages
  const uniqueLanguages = new Set(
    allMovies.map((movie) => movie.language)
  );

  totalMoviesElement.textContent = totalMovies;
  averageRatingElement.textContent =
    averageRating.toFixed(1);

  languageCountElement.textContent =
    uniqueLanguages.size;

  // Total favourites
  try {
    const favourites = await getFavourites();

    totalFavouritesElement.textContent =
      favourites.length;
  } catch (error) {
    console.error(
      "Unable to load favourite statistics:",
      error.message
    );

    totalFavouritesElement.textContent = "0";
  }

  // Movies by language
  const languageCounts = {};

  allMovies.forEach((movie) => {
    const language = movie.language || "Unknown";

    languageCounts[language] =
      (languageCounts[language] || 0) + 1;
  });

  languageStatsElement.innerHTML = "";

  Object.entries(languageCounts).forEach(
    ([language, count]) => {
      const languageItem =
        document.createElement("div");

      languageItem.className =
        "language-stat-item";

      languageItem.innerHTML = `
        <span>${language}</span>
        <strong>${count} movies</strong>
      `;

      languageStatsElement.appendChild(languageItem);
    }
  );
};
/* =========================================
   CLOSE MODALS WITH ESCAPE KEY
   ========================================= */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const movieModalElement = document.getElementById("movieModal");
  const addMovieModalElement = document.getElementById("addMovieModal");
  const editMovieModalElement = document.getElementById("editMovieModal");

  if (movieModalElement) {
    movieModalElement.style.display = "none";
  }

  if (addMovieModalElement) {
    addMovieModalElement.style.display = "none";
  }

  if (editMovieModalElement) {
    editMovieModalElement.style.display = "none";
  }
});
showToast("Welcome to CineVault! 🎬");