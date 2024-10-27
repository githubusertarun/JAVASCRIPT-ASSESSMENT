let page = 1;
const itemsPerPage = 10;
let allResults = [];
let displayedResults = [];

const searchResults = document.querySelector(".search-results");
const searchInput = document.getElementById("search-input");
const languageSelect = document.getElementById("language-select");
const showMoreButton = document.getElementById("show-more-button");

// Predefined set of languages
const languages = ["English", "Kannada", "Hindi", "Telugu", "Tamil", "Malayalam"];

// Function to get random likes
function getRandomLikes() {
  return Math.floor(Math.random() * 1000) + 1;
}

// Function to get a random language
function getRandomLanguage() {
  return languages[Math.floor(Math.random() * languages.length)];
}

// Function to fetch data from JSON Placeholder API
function fetchData() {
  const API_URL = `https://jsonplaceholder.typicode.com/photos?_limit=50`;

  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      allResults = data.map(item => ({
        ...item,
        likes: getRandomLikes(),
        language: getRandomLanguage(),
      }));
      filterAndDisplayResults();
    })
    .catch(error => console.error("Error fetching data:", error));
}

// Function to filter and display results based on search input and language selection
function filterAndDisplayResults() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedLanguage = languageSelect.value;

  displayedResults = allResults.filter(item => {
    const matchesSearchTerm = item.title.toLowerCase().includes(searchTerm);
    const matchesLanguage = selectedLanguage === "all" || item.language === selectedLanguage;
    return matchesSearchTerm && matchesLanguage;
  });

  displayResults();
}

// Function to display results with pagination
function displayResults() {
  searchResults.innerHTML = ""; // Clear previous results

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const resultsToDisplay = displayedResults.slice(0, end);

  resultsToDisplay.forEach(result => {
    const searchResult = document.createElement("div");
    searchResult.classList.add("search-result");

    const image = document.createElement("img");
    image.src = result.thumbnailUrl;
    image.alt = result.title;

    const anchor = document.createElement("a");
    anchor.href = "#";
    anchor.textContent = result.title;

    const likesDisplay = document.createElement("p");
    likesDisplay.textContent = `${result.likes} Likes`;

    const languageDisplay = document.createElement("p");
    languageDisplay.textContent = `Language: ${result.language}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      searchResult.remove();
    });

    searchResult.append(image, anchor, likesDisplay, languageDisplay, deleteButton);
    searchResults.appendChild(searchResult);
  });

  // Update "Show more" button visibility
  showMoreButton.style.display = end < displayedResults.length ? "block" : "none";
}

// Event listeners for search and filter inputs
searchInput.addEventListener("input", () => {
  page = 1;
  filterAndDisplayResults();
});

languageSelect.addEventListener("change", () => {
  page = 1;
  filterAndDisplayResults();
});

// Event listener for the "Show more" button
showMoreButton.addEventListener("click", () => {
  page++;
  displayResults();
});

// Initial fetch
fetchData();
