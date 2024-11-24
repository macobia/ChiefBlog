const cardsArray = [1, 2, 3, 4, 5, 6, 7, 8];
let cards = [...cardsArray, ...cardsArray]; // Duplicate cards to create pairs
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let matchedPairs = 0;
let timer;
let timeLeft = 50;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = ''; // Clear previous cards
    shuffle(cards);
    cards.forEach(num => {
        const card = document.createElement('div');
        card.classList.add('card', 'hidden');
        card.dataset.number = num;
        card.addEventListener('click', flipCard);
        gameContainer.appendChild(card);
    });
    matchedPairs = 0; // Reset matched pairs
    document.getElementById('congratulations').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('restartBtn').style.display = 'none';
    timeLeft = 50; // Reset timer
    document.getElementById('timer').textContent = `Time: ${timeLeft}s`;
    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(timer);
            endGame(false);
        }
    }, 1000);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.remove('hidden');
    this.textContent = this.dataset.number;

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.number === secondCard.dataset.number;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    matchedPairs++;
    if (matchedPairs === cardsArray.length) {
        endGame(true);
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.add('hidden');
        secondCard.classList.add('hidden');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function updateScore() {
    let score = parseInt(localStorage.getItem('score')) || 0;
    score += 100;
    localStorage.setItem('score', score);
    document.getElementById('score').textContent = `Score: ${score}`;
}

function resetScore() {
    localStorage.setItem('score', 0);
    document.getElementById('score').textContent = `Score: 0`;
}

function endGame(isWin) {
    clearInterval(timer);
    if (isWin) {
        document.getElementById('congratulations').style.display = 'block';
        updateScore();
    } else {
        document.getElementById('gameOver').style.display = 'block';
    }
    document.getElementById('restartBtn').style.display = 'block';
}

function restartGame() {
    createBoard();
}

// Initialize game
document.getElementById('score').textContent = `Score: ${localStorage.getItem('score') || 0}`;
createBoard();


// to go back to home page
function goBack() {
window.location.href = "home.html";
}