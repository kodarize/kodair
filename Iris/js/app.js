const searchForm = document.querySelector("form");
const searchInput = document.querySelector("input[name=q]");
const overlay = document.querySelector(".overlay");
let loadMsgElement = document.querySelector(".loadMsg");

// Load the bangs configuration from the JSON file
const BANGS_URLS = {};
// Load the loading configuration from the JSON file
const LOAD = {};

fetch("json/bangs.json")
  .then((response) => response.json())
  .then((data) => {
    Object.assign(BANGS_URLS, data);
  })
  .catch((error) => {
    console.error("Failed to load bangs configuration:", error);
  });

fetch("./json/loading.json")
  .then((response) => response.json())
  .then((data) => {
    const numLoadMsg = Object.keys(data).length;
    Object.assign(LOAD, data);
  })
  .catch((error) => {
    console.error("Failed to fetch load configuration:", error);
  });

function submitSearchForm() {
  let searchUrl = "https://www.bing.com/search?q=";
  let query = searchInput.value.trim();
  let words = query.split(" ");

  // Check if any of the words starts with a bang
  let bangs = words.filter((word) => word.startsWith("!"));

  if (bangs.length > 0) {
    // Check if all the bangs are the same
    let sameBangs = bangs.every((bang) => bang === bangs[0]);

    if (!sameBangs) {
      // Show error message to user
      removeOverlay();
      alert("More than one type of bang found in search query!");
      return;
    }

    let bang = bangs[0];
    let searchQuery = words.filter((word) => !word.startsWith("!")).join(" ");
    let [searchEngine, searchType] = bang.split(".");
    console.log("Search Engine: " + searchEngine);
    console.log("Search Type:" + searchType);

    if (searchEngine in BANGS_URLS) {
      let bangData = BANGS_URLS[searchEngine];
      if (searchType && bangData["tags"] && searchType in bangData["tags"]) {
        searchUrl = bangData["tags"][searchType].replace("%s", encodeURIComponent(searchQuery));
      } else {
        searchUrl = bangData["url"].replace("%s", encodeURIComponent(searchQuery));
      }
    } else {
      searchUrl += encodeURIComponent(query);
    }
  } else {
    searchUrl += encodeURIComponent(query);
  }

  window.location.href = searchUrl;
}

function navigateAI() {
  let query = searchInput.value.trim();
  const trimmedQuery = query.replace(/\!ai/g, "");
  window.location.href = `https://exa.ai/search?c=all&q=${trimmedQuery}`;
  overlay.style.transition = "opacity 1s ease";
  addOverlay();
}

function addLoadMsg() {
  let x = Math.floor((Math.random() * Object.keys(LOAD).length) + 1);
  loadMsgElement.textContent = LOAD[x];
}

// Check if a query parameter is present in the URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("query");
if (query) {
  searchInput.value = query;
  submitSearchForm();
}

// Add event listener to the search form
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addOverlay();
  setTimeout(function () {
    submitSearchForm(); // submit the form after a 0.5s delay
  }, 64);
});

function addOverlay() {
  addLoadMsg();
  overlay.style.opacity = 1;
  overlay.style.zIndex = 999;
}

function removeOverlay() {
  loadMsgElement.textContent = "";
  overlay.style.opacity = 0;
  overlay.style.zIndex = -1;
}

document.addEventListener("keydown", function (event) {
  var searchInput = document.querySelector("#search-box");
  if (document.activeElement === searchInput) return;

  if (event.code === "Slash") {
    event.preventDefault();
    searchInput.focus();
    searchInput.value = searchInput.value;
    searchInput.setSelectionRange(
      searchInput.value.length,
      searchInput.value.length
    );
  }
});

document.getElementById("search-box").focus();
