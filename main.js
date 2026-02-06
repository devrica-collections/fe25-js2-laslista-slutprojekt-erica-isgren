import { gamesRef, db } from "./modules/firebaseconfig.js";
import { ref, remove, update, push, get } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

class Game{
    constructor(title, developer, favorite, timestamp = '', id = '') {
        this.title = title;
        this.developer = developer;
        this.favorite = favorite;
        this.timestamp = timestamp;
        this.id = id;
    }
}

const titleInput = document.querySelector('#title');
const developerInput = document.querySelector('#developer');
const favoriteInput = document.querySelector('#favorite');
const form = document.querySelector('form');
const gamesList = document.querySelector('#games-list');

const showFavBtn = document.querySelector('#filter-favorites');
const sort = document.querySelector('#sort');

let gameArray = [];

function addGame() {
    const title = titleInput.value;
    const developer = developerInput.value;
    const favorite = favoriteInput.checked;
    const newGame = new Game(title, developer, favorite, Date.now());

    push(ref(db, 'games/'), {
        title: newGame.title,
        developer: newGame.developer,
        favorite: newGame.favorite,
        timestamp: newGame.timestamp,
    })
    .then(res => {
        console.log("saved");
        form.reset();
        newGame.id = res.key;
        gameArray.push(newGame);
        displayGames((filterGames(sortGames(gameArray)))); //hämtar added games id för att uppdatera display med nyligen tillagd game
    })
    .catch((error) => {
        console.error("failed", error);
    });

}

async function getGames(){
    gameArray = [];
    const snapshot = await get(gamesRef);
        if(snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const gameSnapshot = childSnapshot.val();
                const game = new Game(gameSnapshot.title, gameSnapshot.developer, gameSnapshot.favorite, gameSnapshot.timestamp, childSnapshot.key);
                gameArray.push(game);
            })
        }
}

function makeCard(gameData) {
    const listItem = document.createElement('li');
    listItem.id = gameData.id;
    const dateAdded = new Date(gameData.timestamp).toLocaleString();

    const h3 = document.createElement('h3');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');
    const delBtn = document.createElement('button');
    const favButton = document.createElement('button')

    listItem.appendChild(h3);
    listItem.appendChild(p1);
    listItem.appendChild(p2);
    listItem.appendChild(p3);
    listItem.appendChild(delBtn);
    listItem.appendChild(favButton);

    h3.innerText = `${gameData.title}`;
    p1.innerText = `Developer: ${gameData.developer}`;
    p2.innerText = `Favorite: ${gameData.favorite}`;
    p3.innerText = `Added: ${dateAdded}`;
    delBtn.classList.add('delete-btn');
    delBtn.setAttribute('data-id', gameData.id);
    delBtn.innerText = `Delete`;
    favButton.setAttribute('data-id', gameData.id);
    favButton.innerText = `Toggle Favorite?`;
    
    delBtn.addEventListener('click', (e) => {
        const gameDelete = e.target.dataset.id;
        deleteGame(gameDelete);
    });

    favButton.addEventListener('click', (e) => {
        const favGame = e.target.dataset.id;
        const game = gameArray.find(g => g.id === favGame);
        if (game){
            game.favorite = !game.favorite;
            toggleFavorite(favGame, game.favorite);
            p2.innerText = `Favorite: ${game.favorite}`;
        }
    })
    return listItem;
};

function displayGames(displayArray) {
    gamesList.innerHTML = '';
    displayArray.forEach(game => {
        const gameCard = makeCard(game);
        gamesList.appendChild(gameCard);
    })
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    addGame(event);
});

function toggleFavorite(gameId, favorite) {
    const favRef = ref(db, `games/${gameId}`);
    const updateFav = {favorite: favorite};
    update(favRef, updateFav)
        .then(() => console.log('updated'))
        .catch((error) => console.log('fucked up', error));
}

function deleteGame(gameId) {
    const gameDelRef = ref(db, `games/${gameId}`);
    remove(gameDelRef)
        .then(() => {
            console.log(`game with ID ${gameId} deleted.`);
            document.getElementById(gameId).remove();
        })
        .catch((error) => {
            console.error("Error deleting game:", error);
        });
}

sort.addEventListener('change', () => displayGames(filterGames(sortGames(gameArray))));

function sortGames(gameArray){
    let sortArray = null;
    switch (sort.value) {
        case 'title-descending':
            sortArray = gameArray.toSorted((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-ascending':
            sortArray = gameArray.toSorted((b, a) => a.title.localeCompare(b.title));
            break;
        case 'date-latest':
            sortArray = gameArray.toSorted((b, a) => a.timestamp - b.timestamp);
            break;
        case 'date-oldest':
            sortArray = gameArray.toSorted((a, b) => a.timestamp - b.timestamp);
            break;
        default:
            console.log('no sorting value was found');
            sortArray = gameArray;//eftersom funcional programming, skapar en ny array med value från gamearray, så de inte blir sidoeffekter
            break;
    }
    return sortArray;
}

showFavBtn.addEventListener('click', () => displayGames(filterGames(sortGames(gameArray))));

const filter = field => value => arr => arr.filter(gameFav => gameFav[field] === value);
const filterFav = filter('favorite');
const filterFavorites = filterFav(true);

function filterGames(gameArray){
    let filterArray = gameArray; //samma sak som i sortArray
    if(showFavBtn.checked) {
        filterArray = filterFavorites(gameArray);
    }
    return filterArray;
}

await getGames();
displayGames(filterGames(sortGames(gameArray)));