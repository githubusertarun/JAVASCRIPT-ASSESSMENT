let page = 1;

const searchResults = document.querySelector(".search-results");
const searchInput = document.getElementById("search-input");
const languageSelect = document.getElementById("language-select");
let searchInputValue = "";

// Predefined set of languages
const languages = ["English", "Kannada", "Hindi", "Telugu", "Tamil", "Malayalam"];

function getImages() {
  searchInputValue = searchInput.value;

  // Get the selected language
  const selectedLanguage = languageSelect.value;

  if (searchInputValue === "") {
    window.alert("Oops!....Empty query. You need to input a value");
    return; // Prevent further execution if input is empty
  }

  const API = `https://api.unsplash.com/search/photos/?query=${searchInputValue}&client_id=QGtQu40-81LdBQtPOjxktYTtKy3b1OIAfw-tsB7XELU&page=${page}&orientation=landscape`;

  if (page === 1) {
    searchResults.innerHTML = "";
  }

  fetch(API)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not okay");
      }
      return response.json();
    })
    .then((response) => {
      if (response.results.length === 0) {
        window.alert("No results found for your query.");
        return; // Stop if no results
      }

      response.results.forEach((result) => {
        const searchResult = document.createElement("div");
        searchResult.classList.add("search-result");

        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description;

        const anchor = document.createElement("a");
        anchor.href = result.links.html;
        anchor.target = "_blank";
        anchor.textContent = result.alt_description;

        // Generate a random number for likes between 1 and 1000
        const likes = Math.floor(Math.random() * 1000) + 1;
        const likesDisplay = document.createElement("p");
        likesDisplay.textContent = `${likes} Likes`; // Display likes

        // Display the selected language
        const languageDisplay = document.createElement("p");
        languageDisplay.textContent = `Language: ${selectedLanguage}`; // Display selected language

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");

        // Add event listener to delete the card
        deleteButton.addEventListener("click", () => {
          searchResult.remove();
        });

        // Append elements to the search result
        searchResult.append(image);
        searchResult.append(anchor);
        searchResult.append(likesDisplay); // Append likes display
        searchResult.append(languageDisplay); // Append language display
        searchResult.append(deleteButton); // Append the delete button to the card
        searchResults.append(searchResult);
      });

      page++;

      // Show the "Show more" button if more than one page of results
      if (response.total_pages > page) {
        document.getElementById("show-more-button").style.display = "block";
      } else {
        document.getElementById("show-more-button").style.display = "none"; // Hide if no more pages
      }
    })
    .catch((err) => console.log(err));
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  page = 1;
  getImages();
});

document.getElementById("show-more-button").addEventListener("click", () => {
  getImages();
});
