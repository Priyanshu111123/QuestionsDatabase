const searchInput = document.getElementById("search");
const resultsContainer = document.getElementById("results");
const paginationContainer = document.getElementById("pagination");
const anagramFilter = document.getElementById("anagramFilter");
const mcqFilter = document.getElementById("mcqFilter");

let currentPage = 1;
const resultsPerPage = 8;

async function fetchResults(query, filterType, page) {
    const response = await fetch(
        `http://localhost:3000/search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(filterType)}&page=${page}&limit=${resultsPerPage}`
    );
    const data = await response.json();
    return data;
}

function renderResults(results) {
    resultsContainer.innerHTML = ""; 
    results.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("result-item");

        const title = document.createElement("div");
        title.classList.add("question-title");
        title.textContent = item.title;

        const type = document.createElement("div");
        type.classList.add("question-type");
        type.textContent = `Type: ${item.type}`;

        li.appendChild(title);
        li.appendChild(type);
        resultsContainer.appendChild(li);
    });
}

function renderPagination(totalPages) {
    paginationContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.classList.add("pagination-button");
        if (i === currentPage) button.classList.add("active");
        button.textContent = i;
        button.addEventListener("click", () => {
            currentPage = i;
            updateResults();
        });
        paginationContainer.appendChild(button);
    }
}

async function updateResults() {
    const query = searchInput.value;
    let filterType = '';
    if (anagramFilter.checked) {
        filterType = 'ANAGRAM';
    } else if (mcqFilter.checked) {
        filterType = 'MCQ';
    }

    const data = await fetchResults(query, filterType, currentPage);
    renderResults(data.results);
    renderPagination(data.totalPages);
}

searchInput.addEventListener("input", () => {
    currentPage = 1;
    updateResults();
});

anagramFilter.addEventListener("change", updateResults);
mcqFilter.addEventListener("change", updateResults);

updateResults();

