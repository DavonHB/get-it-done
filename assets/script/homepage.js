var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl =document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repos-search-term");

var getUserRepos = function() {
    //format the github api url
   var apiUrl = "https://api.github/com/users" + user + "/repos";

    //make a request to the url
   fetch(apiUrl).then(function(response) {
       if (response.ok) {
           response.json().then(function(data) {
               displayRepos(data, user);
           });
       } else {
           alert("Error: GitHub User Not Found");
       }
   })
   .catch(function(error) {
       //notice this `.catch()` getting chained onto the end of the `.then()` method
       alert("Unable to connect to GitHub");
   })
};

var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);

    //get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

var displayRepos = function(repos, searchTerm) {
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    //check if apu returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found";
        return;
    }

    //loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //create a span element to hold repo name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to container
        repoEl.appendChild(titleEl);

        //create status element 
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues 
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container
        repoEl.appendChild(statusEl);

        //append container to dom 
        repoContainerEl.appendChild(repoEl);
    }
};

console.log("outside");

userFormEl.addEventListener("submit", formSubmitHandler);