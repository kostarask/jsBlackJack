let card1;
let card2;
let sum;
let dealerSum;
let btn = document.getElementById("btn");
let stopBtn = document.getElementById("stop");
let messageEl = document.getElementById("message-el");
let dealerEl = document.getElementById("dealer");
let playerSumEL = document.getElementById("playerSum");

function DealerCards(dealerOpenCard, dealerClosedCard, dealerSum) {
    this.dealerOpenCard = Math.floor(Math.random() * 10) + 1;
    this.dealerClosedCard = Math.floor(Math.random() * 10) + 1;
    this.dealerSum = dealerOpenCard + dealerClosedCard;
}

function PlayerCards(card1, card2) {
    this.card1 = Math.floor(Math.random() * 10) + 1;
    this.card2 = Math.floor(Math.random() * 10) + 1;
}

function newGame() {
    const player = new PlayerCards();
    playerSum = player["card1"] + player["card2"];

    const dealer = new DealerCards();
    dealerSum = dealer["dealerOpenCard"] + dealer["dealerClosedCard"];

    playerSumEL.textContent = playerSum;

    dealerEl.textContent = "Dealer: " + dealer["dealerOpenCard"];

    btn.textContent = "Draw";
    btn.setAttribute("onClick", "draw()");

    stopBtn.style.display = "block";

    messageEl.textContent = "Draw or Hold?";
    messageEl.style.color = "whitesmoke";
}

function draw() {
    playerSum += Math.floor(Math.random() * 10) + 1;

    if (playerSum < 21) {
        messageEl.textContent = "Draw or Hold?";

        playerSumEL.textContent = playerSum;
    }

    if (playerSum === 21) {
        messageEl.textContent = "Blackjack!";
        messageEl.style.color = "green";

        playerSumEL.textContent = playerSum;

        dealerEl.textContent = "Dealer: " + dealerSum;

        btn.textContent = "Start New Game";
        btn.setAttribute("onClick", "newGame()");

        stopBtn.style.display = "none";

        return;
    }

    if (playerSum > 21) {
        messageEl.textContent = "You're fucked";
        messageEl.style.color = "red";

        playerSumEL.textContent = playerSum;

        dealerEl.textContent = "Dealer: " + dealerSum;

        btn.textContent = "Start New Game";
        btn.setAttribute("onClick", "newGame()");

        stopBtn.style.display = "none";

        return;
    }
}

function stop() {
    btn.textContent = "Start New Game";
    btn.setAttribute("onClick", "newGame()");

    stopBtn.style.display = "none";

    while (dealerSum < 17) {
        dealerSum += Math.floor(Math.random() * 10) + 1;
    }

    dealerEl.textContent = "Dealer: " + dealerSum;

    if (dealerSum > playerSum && dealerSum <= 21) {
        messageEl.textContent = "Dealer wins";
        messageEl.style.color = "red";
    }
    if (dealerSum < playerSum || dealerSum > 21) {
        messageEl.textContent = "Player Wins";
    }
    if (dealerSum === playerSum) {
        messageEl.textContent = "Game is a Draw";
    }
}

let suits = ["spades", "hearts", "diamonds", "clubs"];
let cardValues = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
];

/**
 *
 * @returns array of Card objects (10*52)
 */
function getDeck() {
    let deck = new Array();
    for (let x = 0; x < 9; x++) {
        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < cardValues.length; j++) {
                let card = { Value: cardValues[j], Suit: suits[i] };
                deck.push(card);
            }
        }
    }
    return deck;
}

function shuffleDeck(array) {
    var copy = [],
        n = array.length,
        i;

    // While there remain elements to shuffle…
    while (n) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * n--);

        // And move it to the new array.
        copy.push(array.splice(i, 1)[0]);
    }

    return copy;
}

let blackjackDecks = shuffleDeck(getDeck());

let exCard = blackjackDecks.pop();

console.log(exCard);
