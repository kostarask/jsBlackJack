let suits = ["spades", "hearts", "diamonds", "clubs"];
let cardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

let deck = new Array();
let playersArray = new Array();

let usedCards = new Array();
let container = ".dealer-card-container";

let realCardValue;

let closedCard;
let newCard;
let player;
let dealer;

let totalBet = 0;
let lastBet = 0;

let splitExists = false;

/*============================
    button elements
   =========================== */
let startGameBtn = document.getElementById("btn");
let startNewGameBtn = document.getElementById("start-new-game-btn");

//Bet related buttons
let makeBetBtn = document.getElementById("make-bet-btn");
let resetBetBtn = document.getElementById("reset-bet-btn");
let undoBetBtn = document.getElementById("undo-bet-btn");

//Play related DOM items
let drawBtn = document.getElementById("draw");
let stopBtn = document.getElementById("stop");
let doubleBtn = document.getElementById("double");
let splitBtn = document.getElementById("split");

//Message DOM element
let messageEl = document.getElementById("message-el");

//Dealer related DOM elements
let dealerScoreEl = document.getElementById("dealer-score");
let dealerH2 = document.querySelector(".dealer-h2");

// Player related DOM elements
let playerH2 = document.querySelector(".player-h2");
let playerCreditEl = document.querySelector(".player-credit");
let playerBetEl = document.querySelector(".player-bet");
let playerScoreEl = document.getElementById("player-score");

// Split related DOM elements
let playerSplitScoreEl;
/*=================================================
    Functions Table of Contents
        1.Deck related functions
        2.Card related functions
        3.Chip related functions
        4.Bet related functions
        5.Dealer related functions
        6.Player related functions
        7.GamePlay related functions
        8.Game resolving related functions
        9.Game staging related functions
=================================================== */

/*=================================================
    1.Deck related functions
=================================================== */

/**
 *
 * @returns array of Card objects (10*52)
 */
function getDeck() {
    for (let x = 0; x < 9; x++) {
        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < cardValues.length; j++) {
                let card = { Value: cardValues[j], Suit: suits[i] };
                deck.push(card);
            }
        }
    }
    // return deck;
}

function shuffle() {
    // for 1000 turns
    // switch the values of two random cards
    for (var i = 0; i < 1000; i++) {
        var location1 = Math.floor(Math.random() * deck.length);
        var location2 = Math.floor(Math.random() * deck.length);
        var tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}

/*====================================
    2.Card related functions
====================================== */

function getCard(deck) {
    let card = deck.pop();
    usedCards.push(card);
    return card;
}

function getClosedCard() {
    let closedCard = { Suit: "closed", Value: "" };
    return closedCard;
}

function getRealCardValue(cardValue, sum) {
    switch (cardValue) {
        case "2":
            realCardValue = 2;
            break;
        case "3":
            realCardValue = 3;
            break;
        case "4":
            realCardValue = 4;
            break;
        case "5":
            realCardValue = 5;
            break;
        case "6":
            realCardValue = 6;
            break;
        case "7":
            realCardValue = 7;
            break;
        case "8":
            realCardValue = 8;
            break;
        case "9":
            realCardValue = 9;
            break;
        case "10":
            realCardValue = 10;
            break;
        case "J":
            realCardValue = 10;
            break;
        case "Q":
            realCardValue = 10;
            break;
        case "K":
            realCardValue = 10;
            break;
        // case "a":
        //     realCardValue = 1;
        //     break;
        case "A":
            // if (sum + 11 > 21) {
            //     realCardValue = 1;
            // } else {
            //     realCardValue = 11;
            // }
            realCardValue = 11;

            break;
    }
    return realCardValue;
}

function renderCard(cardObj, container) {
    let card = document.createElement("div");
    let value = document.createElement("div");
    let suit = document.createElement("div");

    card.className = "card";
    value.className = "value";
    suit.className = "suit " + cardObj.Suit;
    value.innerText = cardObj.Value;

    if (cardObj.Suit != "closed") {
        card.appendChild(value);
        card.appendChild(suit);
    }
    if (cardObj.Suit === "closed") {
        card.className = "closed";
    }

    document.querySelector(container).appendChild(card);
}

// TODO:Correct with loop label and break
// Player object with numOfAces so that actual card value doesn't change
function correctMiddleAces(playerObj) {
    if (playerObj.NumOfAces > 0) {
        while (playerObj.Score > 21) {
            playerObj.Score -= 10;
            playerObj.NumOfAces--;
        }
    }
}

function deleteCards() {
    // let element = document.querySelector(
    //     "body > div > div > div.card-container.dealer-card-container "
    // );
    // while (element.lastChild.id !== "dealer") {
    //     element.removeChild(element.lastChild);
    // }
    // element = document.querySelector(
    //     "body > div > div > div.card-container.player-card-container "
    // );
    // while (element.lastChild.id !== "player") {
    //     element.removeChild(element.lastChild);
    // }

    let cards = document.getElementsByClassName("card");
    while (cards.length > 0) {
        cards[0].parentElement.removeChild(cards[0]);
    }
}

function revealClosedCard() {
    let select = document.querySelector(
        "body > div > div > div.card-container.dealer-card-container"
    );
    select.removeChild(select.lastChild);

    renderCard(dealer.Hand[1], ".dealer-card-container");
    dealerScoreEl.textContent = dealer.Score;
}

/*===================================================
    3.Chip related functions
=================================================== */

function renderChips(chipValue) {
    let chip = document.createElement("button");
    chip.className = "chip-btn";
    chip.value = chipValue;
    chip.onclick = function () {
        bet(chipValue);
    };
    chip.textContent = chipValue + "$";
    if (chipValue > player.Credit) {
        chip.disabled = true;
    }
    document.querySelector(".betting-el").appendChild(chip);
}

function checkChips() {
    let chips = document.getElementsByClassName("chip-btn");

    for (let i = 0; i < chips.length; i++) {
        if (chips[i].value > player.Credit) {
            chips[i].disabled = true;
        } else {
            chips[i].disabled = false;
        }
    }
}

function removeChipElements() {
    let chips = document.getElementsByClassName("chip-btn");
    while (chips.length > 0) {
        chips[0].parentElement.removeChild(chips[0]);
    }
}

/*===================================================
    4.Bet related functions
===================================================*/
function bet(chipValue) {
    totalBet += chipValue;
    lastBet = chipValue;
    player.Credit -= chipValue;
    messageEl.textContent = "Bet: " + totalBet + "$";
    checkChips();
    checkBet();
}

function undoBet() {
    totalBet -= lastBet;
    player.Credit += lastBet;
    messageEl.textContent = "Bet: " + totalBet + "$";
    checkChips();
    checkBet();
}

function resetBet() {
    player.Credit += totalBet;

    totalBet = 0;
    messageEl.textContent = "Bet: " + totalBet + "$";
    checkChips();
    checkBet();
}

function checkBet() {
    if (!totalBet > 0) {
        makeBetBtn.disabled = true;
    } else {
        makeBetBtn.disabled = false;
    }
}

/*===================================================
    5.Dealer related functions
=================================================== */
function createDealer() {
    let hand = new Array();
    dealer = { Hand: hand, Score: 0, InitialScore: 0 };
}

function createDealerInitialCards() {
    for (let i = 0; i < 2; i++) {
        newCard = getCard(deck);
        // if (i === 0) {
        //     newCard = ace;
        // } else {
        //     newCard = king;
        // }
        realCardValue = getRealCardValue(newCard.Value, dealer.Score);
        dealer.Hand.push(newCard);
        dealer.Score += realCardValue;
        if (i === 0) {
            renderCard(newCard, ".dealer-card-container");
            dealer.InitialScore += realCardValue;
        }
    }

    closedCard = getClosedCard();
    renderCard(closedCard, ".dealer-card-container");
}

function dealerDraw() {
    newCard = getCard(deck);
    realCardValue = getRealCardValue(newCard.Value, dealer.Score);
    dealer.Hand.push(newCard);
    dealer.Score = dealer.Score + realCardValue;
    renderCard(newCard, ".dealer-card-container");
    correctMiddleAces(dealer);
}

/*===================================================
    6.Player related functions
=================================================== */

function createPlayers(numOfPlayers) {
    for (let i = 1; i <= numOfPlayers; i++) {
        let hand = new Array();
        let splitHand = new Array();
        let player = {
            Name: "Player " + i,
            PlayerId: i,
            Hand: hand,
            SplitHand: splitHand,
            SplitScore: 0,
            Score: 0,
            Credit: 20000,
            NumOfAces: 0,
        };
        playersArray.push(player);
    }
}

function resetPlayersHandAndScore() {
    dealer.Score = 0;
    dealer.Hand.length = 0;
    dealer.InitialScore = 0;

    player.Score = 0;
    player.Hand.length = 0;
    player.NumOfAces = 0;

    player.SplitScore = 0;
    player.SplitHand.length = 0;
}

function createPlayerInitialCards() {
    player.NumOfAces = 0;
    for (let i = 0; i < 2; i++) {
        let eight = { Value: "A", Suit: "spades" };
        let eight2 = { Value: "A", Suit: "hearts" };
        let eight3 = { Value: "A", Suit: "clubs" };
        newCard = getCard(deck);
        // if (i === 0) {
        //     newCard = eight;
        // } else if (i === 1) {
        //     newCard = eight2;
        // } else {
        //     newCard = eight3;
        // }
        realCardValue = getRealCardValue(newCard.Value, player.Score);
        player.Hand.push(newCard);
        if (newCard.Value === "A") {
            player.NumOfAces++;
        }

        renderCard(newCard, ".player-card-container");
        player.Score += realCardValue;
        correctMiddleAces(player);

        playerH2.textContent = player.Name;
        playerCreditEl.textContent = "Credit: " + player.Credit + "$";
    }
}

/*===================================================
    7.GamePlay related functions
=================================================== */

function draw() {
    splitBtn.hidden = true;
    doubleBtn.disabled = true;
    newCard = getCard(deck);
    realCardValue = getRealCardValue(newCard.Value, player.Score);
    player.Hand.push(newCard);
    if (newCard.Value === "A") {
        player.NumOfAces++;
    }

    renderCard(newCard, ".player-card-container");
    player.Score += realCardValue;
    correctMiddleAces(player);

    if (player.Score >= 21) {
        endGame();
    }
    playerScoreEl.textContent = player.Score;
}

function double() {
    newCard = getCard(deck);
    realCardValue = getRealCardValue(newCard.Value, player.Score);
    player.Hand.push(newCard);

    renderCard(newCard, ".player-card-container");
    player.Score += realCardValue;
    correctMiddleAces(player.Score);
    player.Credit -= totalBet;
    totalBet = 2 * totalBet;

    playerCreditEl.textContent = "Credit: " + player.Credit + "$";
    playerBetEl.textContent = "Bet: " + player.Credit + "$";

    endGame();
    playerScoreEl.textContent = player.Score;
}

function createSplitDiv() {
    document.querySelector(".no-split").className = "split";
    let playerDiv = document.createElement("div");
    let playerCardContainer = document.createElement("div");
    let playerPar = document.createElement("p");
    let playerCards = document.createElement("div");
    let playerScorePar = document.createElement("p");
    let playerScoreSpan = document.createElement("span");

    playerDiv.className = "player-div player-split-div";

    playerCardContainer.className =
        "card-container player-card-container player-card-container-split";

    playerPar.id = "player";
    playerPar.textContent = "Cards: ";

    playerCards.className = "player-cards";

    playerScorePar.className = "player-score";
    playerScorePar.id = "player";
    playerScorePar.textContent = "Score: ";

    playerScoreSpan.id = "player-score2";
    playerScoreSpan.className = "player-score-split";

    playerCardContainer.appendChild(playerPar);
    playerCardContainer.appendChild(playerCards);
    playerScorePar.appendChild(playerScoreSpan);
    playerDiv.appendChild(playerCardContainer);
    playerDiv.appendChild(playerScorePar);

    document.querySelector(".split").appendChild(playerDiv);
}

function drawSplit() {
    splitBtn.hidden = true;
    doubleBtn.disabled = true;
    newCard = getCard(deck);
    realCardValue = getRealCardValue(newCard.Value, player.SplitScore);
    player.SplitHand.push(newCard);

    renderCard(newCard, ".player-card-container-split");
    player.SplitScore += realCardValue;
    player.SplitScore = correctMiddleAces(player.SplitScore);

    if (player.SplitScore >= 21) {
        endGame();
    }
}

function initializeSplitGame() {
    document
        .querySelector("body > div > div.split > div:nth-child(1) > div > div:nth-child(4)")
        .remove();
    newCard = player.Hand.pop();
    player.Score = getRealCardValue(player.Hand[0].Value, player.Score);

    realCardValue = getRealCardValue(newCard.Value, player.SplitScore);
    player.SplitHand.push(newCard);

    renderCard(newCard, ".player-card-container-split");
    player.SplitScore += realCardValue;
    player.SplitScore = correctMiddleAces(player.SplitScore);

    draw();

    drawSplit();
    playerSplitScoreEl = document.querySelector("#player-score2");
    playerSplitScoreEl.textContent = player.SplitScore;

    playerCreditEl.textContent = "Credit: " + player.Credit + "$";
}

//TODO complete split implementation
function split() {
    splitExists = true;
    createSplitDiv();
    initializeSplitGame();
    // drawBtn.onclick = function () {
    //     drawSplit();
    // };
}

function endGame() {
    startNewGameBtn.hidden = false;
    drawBtn.hidden = true;
    stopBtn.hidden = true;
    splitBtn.hidden = true;
    doubleBtn.hidden = true;
    revealClosedCard();

    if (player.Score <= 21) {
        while (dealer.Score < 17) {
            dealerDraw();
        }
    }
    dealerScoreEl.textContent = dealer.Score;
    resolvePoints();
}

/*===================================================
    8.Game resolving related functions
=================================================== */

function checkForBlackjack() {
    if (player.Score === 21 && player.Hand.length === 2) {
        if (dealer.Score != 21 || dealer.Hand.length > 2) {
            messageEl.textContent = "Winner Winner Chicken Dinner!";
            dealerH2.style.color = "red";
            dealerScoreEl.style.color = "red";
            playerH2.style.color = "goldenrod";
            playerScoreEl.style.color = "goldenrod";
            return true;
        }
    }

    if (player.Score === 21 && player.Hand.lenth === 2) {
        if (dealer.Score === 21 || dealer.Hand.length === 2) {
            messageEl.textContent = "Game is a Draw";
            return true;
        }
    }
}

function resolvePoints() {
    if (checkForBlackjack()) {
        player.Credit += 2.5 * totalBet;
        return;
    }
    if (player.Score > 21) {
        messageEl.textContent = "Player busts";
        playerH2.style.color = "red";
        playerScoreEl.style.color = "red";
        dealerH2.style.color = "goldenrod";
        playerBetEl.style.color = "red";

        dealerScoreEl.style.color = "goldenrod";

        return;
    }

    if (dealer.Score > 21) {
        messageEl.textContent = "Dealer Busts";
        dealerH2.style.color = "red";
        dealerScoreEl.style.color = "red";
        playerH2.style.color = "goldenrod";
        playerScoreEl.style.color = "goldenrod";
        playerBetEl.style.color = "goldenrod";

        player.Credit += 2 * totalBet;

        return;
    }

    if (dealer.Score > player.Score) {
        messageEl.textContent = "Dealer wins";
        dealerH2.style.color = "goldenrod";
        dealerScoreEl.style.color = "goldenrod";
        playerH2.style.color = "red";
        playerScoreEl.style.color = "red";
        playerBetEl.style.color = "red";
    }

    if (dealer.Score < player.Score) {
        messageEl.textContent = "Player Wins";
        dealerH2.style.color = "red";
        dealerScoreEl.style.color = "red";
        playerH2.style.color = "goldenrod";
        playerScoreEl.style.color = "goldenrod";
        playerBetEl.style.color = "goldenrod";
        player.Credit += 2 * totalBet;
    }

    if (dealer.Score === player.Score) {
        messageEl.textContent = "Game is a Draw";
        player.Credit += totalBet;
    }
}

/*======================================================
    9.Game staging related functions
======================================================*/

function deleteSplits() {
    document.querySelector(".split").className = "no-split";
    let splits = document.getElementsByClassName("player-split-div");
    while (splits.length > 0) {
        splits[0].parentElement.removeChild(splits[0]);
    }
}

function playGame() {
    createDealerInitialCards();
    createPlayerInitialCards();

    if (player.Score === 21) {
        endGame();
        playerScoreEl.textContent = player.Score;

        return;
    }

    makeBetBtn.hidden = true;
    undoBetBtn.hidden = true;
    resetBetBtn.hidden = true;

    startNewGameBtn.hidden = true;

    drawBtn.hidden = false;
    stopBtn.hidden = false;
    doubleBtn.hidden = false;
    if (totalBet > player.Credit) {
        doubleBtn.disabled = true;
    }
    splitBtn.hidden = false;
    splitBtn.disabled = true;

    if (totalBet < player.Credit && player.Hand[0].Value === player.Hand[1].Value) {
        splitBtn.disabled = false;
    }

    messageEl.textContent = "Draw or Hold?";
    messageEl.style.color = "whitesmoke";
    playerScoreEl.textContent = player.Score;
    dealerScoreEl.textContent = dealer.InitialScore;
}

function makeBet() {
    removeChipElements();

    makeBetBtn.hidden = true;
    undoBetBtn.hidden = true;
    resetBetBtn.hidden = true;

    playerBetEl.textContent = "Bet: " + totalBet + "$";

    messageEl.style.textAlign = "center";
    messageEl.style.width = "100%";

    playGame();
}

function startGame() {
    deleteCards();
    if (splitExists) {
        deleteSplits();
        splitExists = false;
    }
    resetPlayersHandAndScore();

    totalBet = 0;
    playerBetEl.textContent = "Bet: 0$";

    dealerH2.style.color = "white";
    dealerScoreEl.style.color = "white";
    dealerScoreEl.textContent = "-";
    playerH2.style.color = "white";
    playerScoreEl.style.color = "white";
    playerScoreEl.textContent = "-";
    playerBetEl.style.color = "white";

    playerH2.textContent = player.Name;

    playerCreditEl.textContent = "Credit: " + player.Credit + "$";

    messageEl.textContent = "Bet: 0$";
    messageEl.style.textAlign = "start";
    messageEl.style.width = "9ch";

    renderChips(5);
    renderChips(10);
    renderChips(25);
    renderChips(100);

    startGameBtn.hidden = true;
    startNewGameBtn.hidden = true;
    makeBetBtn.hidden = false;
    undoBetBtn.hidden = false;
    resetBetBtn.hidden = false;

    checkBet();
}

function initializeGame() {
    deck = new Array();
    playersArray = new Array();
    getDeck();
    shuffle();
    createDealer();

    createPlayers(1);
    player = playersArray[0];

    startGame();
}

// window.addEventListener("load", function () {
//     getDeck();
//     shuffle();
//     createPlayers(1);
// });
