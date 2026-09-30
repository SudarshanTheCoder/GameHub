const games = [
    {
        title: "Block Drop",
        image: "images/block-drop.jpg",
        url: "games/block-drop/index.html",
        category: "Puzzle"
    },
    {
        title: "Grand Chess",
        image: "images/grand-chess.jpg",
        url: "games/grand-chess/index.html",
        category: "Board"
    },
    {
        title: "Sky Runner",
        image: "images/sky-runner.jpg",
        url: "games/sky-runner/index.html",
        category: "Arcade"
    },
    {
        title: "Tiny Golf",
        image: "images/tiny-golf.jpg",
        url: "games/tiny-golf/index.html",
        category: "Sports"
    },
    {
        title: "Street Racer",
        image: "images/street-racer.jpg",
        url: "games/street-racer/index.html",
        category: "Racing"
    },
    {
        title: "Word Ladder",
        image: "images/word-ladder.jpg",
        url: "games/word-ladder/index.html",
        category: "Puzzle"
    },
    {
        title: "Merge Numbers",
        image: "images/merge-numbers.jpg",
        url: "games/merge-numbers/index.html",
        category: "Puzzle"
    },
    {
        title: "Bubble Pop",
        image: "images/bubble-pop.jpg",
        url: "games/bubble-pop/index.html",
        category: "Casual"
    },
    {
        title: "Solitaire Classic",
        image: "images/solitaire-classic.jpg",
        url: "games/solitaire-classic/index.html",
        category: "Card"
    },
    {
        title: "Tower Defense Lite",
        image: "images/tower-defense-lite.jpg",
        url: "games/tower-defense-lite/index.html",
        category: "Strategy"
    },
    {
        title: "Pixel Platformer",
        image: "images/pixel-platformer.jpg",
        url: "games/pixel-platformer/index.html",
        category: "Action"
    },
    {
        title: "Snake Classic",
        image: "images/snake-classic.jpg",
        url: "games/snake-classic/index.html",
        category: "Arcade"
    },
    {
        title: "Pool Master",
        image: "images/pool-master.jpg",
        url: "games/pool-master/index.html",
        category: "Sports"
    },
    {
        title: "Jigsaw Garden",
        image: "images/jigsaw-garden.jpg",
        url: "games/jigsaw-garden/index.html",
        category: "Puzzle"
    }
];

const gamesPerPage = 12;
const placeholderColors = ["#dbe4ee", "#e4dfd3", "#d9e8e1", "#ecdcdc", "#e0dcec", "#e6e8d2"];

const searchInput = document.getElementById("search-input");
const gameGrid = document.getElementById("game-grid");
const emptyMessage = document.getElementById("empty-message");
const loadMoreButton = document.getElementById("load-more");
const yearElement = document.getElementById("year");

let filteredGames = games;
let visibleCount = gamesPerPage;

function createPlaceholderImage(title) {
    let hash = 0;

    for (const character of title) {
        hash = (hash * 31 + character.charCodeAt(0)) % placeholderColors.length;
    }

    const initial = title.charAt(0).toUpperCase();
    const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">' +
        '<rect width="640" height="360" fill="' + placeholderColors[hash] + '"/>' +
        '<text x="320" y="180" text-anchor="middle" dominant-baseline="central" ' +
        'font-family="Arial, sans-serif" font-size="140" font-weight="700" fill="#16181d" fill-opacity="0.15">' +
        initial + "</text></svg>";

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function createGameCard(game) {
    const card = document.createElement("a");
    card.className = "game-card";
    card.href = game.url;

    const thumb = document.createElement("div");
    thumb.className = "game-thumb";

    const image = document.createElement("img");
    image.src = game.image;
    image.alt = game.title + " - " + game.category + " game";
    image.width = 640;
    image.height = 360;
    image.loading = "lazy";
    image.addEventListener("error", function () {
        image.src = createPlaceholderImage(game.title);
    }, { once: true });
    thumb.appendChild(image);

    const info = document.createElement("div");
    info.className = "game-info";

    const title = document.createElement("span");
    title.className = "game-title";
    title.textContent = game.title;

    const category = document.createElement("span");
    category.className = "game-category";
    category.textContent = game.category;

    info.append(title, category);
    card.append(thumb, info);

    return card;
}

function filterGames(query) {
    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) {
        return games;
    }

    return games.filter(function (game) {
        return game.title.toLowerCase().includes(searchTerm) ||
            game.category.toLowerCase().includes(searchTerm);
    });
}

function renderGames() {
    const fragment = document.createDocumentFragment();

    filteredGames.slice(0, visibleCount).forEach(function (game) {
        fragment.appendChild(createGameCard(game));
    });

    gameGrid.replaceChildren(fragment);
    emptyMessage.hidden = filteredGames.length > 0;
    loadMoreButton.hidden = visibleCount >= filteredGames.length;
}

function handleSearch() {
    filteredGames = filterGames(searchInput.value);
    visibleCount = gamesPerPage;
    renderGames();
}

function loadMoreGames() {
    visibleCount += gamesPerPage;
    renderGames();
}

searchInput.addEventListener("input", handleSearch);
loadMoreButton.addEventListener("click", loadMoreGames);

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

renderGames();
