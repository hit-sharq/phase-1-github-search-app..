// Get the required elements from the DOM
const githubForm = document.getElementById("github-form");
const searchInput = document.getElementById("search-term");
const userList = document.getElementById("users-list");
const repoList = document.getElementById("repositories-list");
const toggleButton = document.getElementById("toggle-button");

// Event listener to toggle between showing users and repositories
toggleButton.addEventListener("click", () => {
  toggleButton.innerText = toggleButton.innerText === "Show Users" ? "Show Repositories" : "Show Users";
});

// Event listener for form submit
githubForm.addEventListener("submit", (event) => {
  event.preventDefault();
  userList.innerHTML = "";
  repoList.innerHTML = "";
  
  // Check the state of toggle button to decide what to fetch
  if(toggleButton.innerText === "Show Users") {
    // Fetch users based on search input
    fetch(`https://api.github.com/search/users?q=${searchInput.value}`)
      .then(response => response.json())
      .then(data => {
        // Display each user and their repositories
        data.items.forEach(item => {
          const userElement = document.createElement("li");
          userElement.innerHTML = `
            <h2>Username: <i>${item.login}</i></h2>
            <a href=${item.html_url}>Profile Link</a>
            <button data-id=${item.id}>View Repositories</button>
            <hr>
          `;
          userList.appendChild(userElement);
          
          displayRepos(item.id, item.login);
        });
      });
  } else {
    // Fetch repositories based on search input
    fetch(`https://api.github.com/search/repositories?q=${searchInput.value}`)
      .then(response => response.json())
      .then(data => {
        // Display each repository
        data.items.forEach(item => {
          const repoElement = document.createElement("li");
          repoElement.innerHTML = `
            <h2>Repository Name: <i>${item.name}</i></h2>
            <h3>Owner: ${item.owner.login}</h3>
            <a href=${item.html_url}>Repository Link</a>
            <hr>
          `;
          repoList.appendChild(repoElement);
        });
      });
  }
});

// Function to display repositories for a specific user
function displayRepos(userId, username) {
  const reposButton = document.querySelector(`button[data-id='${userId}']`);
  reposButton.addEventListener("click", () => {
    repoList.innerHTML = "";
    // Fetch repositories for the user
    fetch(`https://api.github.com/users/${username}/repos`)
      .then(response => response.json())
      .then(data => {
        // Display each repository
        data.forEach(item => {
          const repoElement = document.createElement("li");
          repoElement.innerHTML = `
            <h3><a href=${item.html_url}>${item.name}</a></h3>
          `;
          repoList.appendChild(repoElement);
        });
      });
  });
}