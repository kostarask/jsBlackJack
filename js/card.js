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
let splitPlayer;
let dealer;

let totalBet = 0;
let lastBet = 0;
let condition;
// let winnings = { Winnings: 0, Condition: condition };
let winningsArray = new Array();

let splitExists = false;
let splitPlayerIsActive = false;
let mainPlayerIsActive = true;

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

// Game Over related DOM elements
let gameOverEl = document.querySelector(".game-over-div");
let winningsHeadEl = document.querySelector(".congrats-head");
let winningsEl = document.querySelector(".winnings-head");

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
        case "A":
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

function correctMiddleAces(playerObj) {
    if (playerObj.NumOfAces > 0) {
        while (playerObj.Score > 21) {
            playerObj.Score -= 10;
            playerObj.NumOfAces--;
        }
    }
}

function deleteCards() {
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
    player.TotalBet += chipValue;
    lastBet = chipValue;
    player.Credit -= chipValue;
    messageEl.textContent = "Bet: " + player.TotalBet + "$";
    checkChips();
    checkBet();
}

function undoBet() {
    if (player.TotalBet > 0) {
        player.TotalBet -= lastBet;
        player.Credit += lastBet;
        messageEl.textContent = "Bet: " + player.TotalBet + "$";
        checkChips();
        checkBet();
    }
}

function resetBet() {
    player.Credit += player.TotalBet;

    player.TotalBet = 0;
    messageEl.textContent = "Bet: " + player.TotalBet + "$";
    checkChips();
    checkBet();
}

function checkBet() {
    if (!player.TotalBet > 0) {
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
        // let splitHand = new Array();
        let player = {
            Name: "Player " + i,
            PlayerId: i,
            Hand: hand,
            Score: 0,
            Credit: 100,
            NumOfAces: 0,
            TotalBet: 0,
        };
        playersArray.push(player);
    }
}

function resetPlayersHandAndScore() {
    splitExists = false;

    dealer.Score = 0;
    dealer.Hand.length = 0;
    dealer.InitialScore = 0;

    player.Score = 0;
    player.Hand.length = 0;
    player.NumOfAces = 0;
    player.TotalBet = 0;

    if (typeof splitPlayer != "undefined") {
        splitPlayer.Score = 0;
        splitPlayer.Hand.length = 0;
        splitPlayer.NumOfAces = 0;
        splitPlayer.TotalBet = 0;

        activateMainPlayer();
    }

    gameOverEl.style.display = "none";
}

function createPlayerInitialCards() {
    player.NumOfAces = 0;
    for (let i = 0; i < 2; i++) {
        let eight = { Value: "10", Suit: "spades" };
        let eight2 = { Value: "A", Suit: "hearts" };
        let eight3 = { Value: "10", Suit: "clubs" };
        newCard = getCard(deck);
        if (i === 0) {
            newCard = eight;
            // } else if (i === 1) {
            //     newCard = eight2;
        } else {
            newCard = eight3;
        }
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

    playerScoreEl.textContent = player.Score;

    if (player.Score >= 21 && splitExists) {
        holdSplit();
        return;
    }
    if (player.Score >= 21) {
        endGame();
        return;
    }
}

function callDouble() {
    if (mainPlayerIsActive) {
        double(player, ".player-card-container", playerScoreEl);
        return;
    }
    if (splitPlayerIsActive) {
        double(splitPlayer, ".player-card-container-split", playerSplitScoreEl); //TODO: correct
        return;
    }
}

function double(playerObj, container, scoreEl) {
    newCard = getCard(deck);
    realCardValue = getRealCardValue(newCard.Value, playerObj.Score);
    playerObj.Hand.push(newCard);

    renderCard(newCard, container);
    playerObj.Score += realCardValue;
    correctMiddleAces(playerObj.Score);
    playerObj.Credit -= playerObj.TotalBet;
    playerObj.TotalBet = 2 * playerObj.TotalBet;

    playerCreditEl.textContent = "Credit: " + (player.Credit + splitPlayer.Credit) + "$";
    playerBetEl.textContent = "Bet: " + (player.TotalBet + splitPlayer.TotalBet) + "$";
    scoreEl.textContent = playerObj.Score;

    if (splitExists && mainPlayerIsActive) {
        holdSplit();
        return;
    }

    endGame();
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
    playerSplitScoreEl = document.querySelector("#player-score2");
}

function drawSplit() {
    splitBtn.hidden = true;
    doubleBtn.disabled = true;
    newCard = getCard(deck);
    renderCard(newCard, ".player-card-container-split");

    realCardValue = getRealCardValue(newCard.Value, player.SplitScore);

    splitPlayer.Hand.push(newCard);

    splitPlayer.Score += realCardValue;
    correctMiddleAces(splitPlayer);

    playerSplitScoreEl.textContent = splitPlayer.Score;
}

function initializeSplitGame() {
    document
        .querySelector("body > div > div.split > div:nth-child(1) > div > div:nth-child(4)")
        .remove();
    newCard = player.Hand.pop();
    player.Score = getRealCardValue(player.Hand[0].Value, player.Score);

    realCardValue = getRealCardValue(newCard.Value, splitPlayer.Score);
    splitPlayer.Hand.push(newCard);

    renderCard(newCard, ".player-card-container-split");
    splitPlayer.Score += realCardValue;
    correctMiddleAces(splitPlayer);

    draw();

    drawSplit();

    activateMainPlayer();

    if (player.Credit > player.TotalBet) {
        doubleBtn.disabled = false;
    }
    playerSplitScoreEl.textContent = splitPlayer.Score;

    playerCreditEl.textContent = "Credit: " + player.Credit + "$";

    stopBtn.onclick = function () {
        holdSplit();
    };
}

function holdSplit() {
    activateSplitPlayer();

    if (splitPlayer.Score >= 21) {
        endGame();
        return;
    }

    drawBtn.onclick = function () {
        drawSplit();
    };

    stopBtn.onclick = function () {
        endGame();
    };

    if (player.Credit > player.TotalBet) {
        doubleBtn.disabled = false;
    }
}

function split() {
    splitExists = true;
    let splitHand = new Array();
    splitPlayer = {
        Name: "SplitPlayer 1",
        PlayerId: 2,
        Hand: splitHand,
        Score: 0,
        Credit: 0,
        NumOfAces: 0,
        TotalBet: 0,
    };
    splitPlayer.TotalBet = player.TotalBet;
    player.Credit -= splitPlayer.TotalBet;

    playerCreditEl.textContent = "Credit: " + player.Credit + "$";
    playerBetEl.textContent = "Bet: " + (player.TotalBet + splitPlayer.TotalBet) + "$";

    createSplitDiv();
    initializeSplitGame();
}

function activateSplitPlayer() {
    splitPlayerIsActive = true;
    mainPlayerIsActive = false;

    document.querySelector(".player-div").classList.remove("active");
    document.querySelector(".player-div").classList.add("inactive");

    document.querySelector(".player-split-div").classList.remove("inactive");
    document.querySelector(".player-split-div").classList.add("active");
}

function activateMainPlayer() {
    mainPlayerIsActive = true;
    splitPlayerIsActive = false;

    document.querySelector(".player-div").classList.remove("inactive");
    document.querySelector(".player-div").classList.add("active");
    if (splitExists) {
        document.querySelector(".player-split-div").classList.remove("active");
        document.querySelector(".player-split-div").classList.add("inactive");
    }
}

function endGame() {
    startNewGameBtn.hidden = false;
    drawBtn.hidden = true;
    stopBtn.hidden = true;
    splitBtn.hidden = true;
    doubleBtn.hidden = true;
    revealClosedCard();

    if (splitExists) {
        splitEndGame();
        return;
    }

    if (player.Score <= 21) {
        while (dealer.Score < 17) {
            dealerDraw();
        }
    }
    dealerScoreEl.textContent = dealer.Score;
    resolvePoints(player);
    console.table(winningsArray);
    console.log(player.Credit);
    player.Credit += getWinnings();
    if (winningsArray[0].IsWinner) {
        document.querySelector(".player-div").style.borderColor = "goldenrod";
    } else {
        document.querySelector(".player-div").style.borderColor = "grey";
    }
    console.log(player.Credit);
    gameOver();
}

function splitEndGame() {
    if (player.Score <= 21 || splitPlayer.Score <= 21) {
        while (dealer.Score < 17) {
            dealerDraw();
        }
    }
    dealerScoreEl.textContent = dealer.Score;
    resolvePoints(player);
    if (winningsArray[0].IsWinner) {
        document.querySelector(".player-div").style.borderColor = "goldenrod";
    } else {
        document.querySelector(".player-div").style.borderColor = "grey";
    }
    resolvePoints(splitPlayer);
    if (winningsArray[1].IsWinner) {
        document.querySelector(".player-split-div").style.borderColor = "goldenrod";
    } else {
        document.querySelector(".player-split-div").style.borderColor = "grey";
    }
    console.table(winningsArray);
    player.Credit += getWinnings();
    gameOver();
}

function gameOver() {
    if (getWinnings() > 0) {
        gameOverEl.style.display = "flex";
        winningsHeadEl.textContent = "Congratulations!";
        winningsEl.textContent = "You won: " + getWinnings() + "$";
    } else {
        gameOverEl.style.display = "flex";
        winningsEl.textContent = "Better luck next time";
        winningsHeadEl.hidden = true;
    }
}

/*===================================================
    8.Game resolving related functions
=================================================== */

function checkForBlackjack(playerObj) {
    if (playerObj.Score === 21 && playerObj.Hand.length === 2) {
        if (dealer.Score != 21 || dealer.Hand.length > 2) {
            messageEl.textContent = "Winner Winner Chicken Dinner!";
            dealerH2.style.color = "red";
            dealerScoreEl.style.color = "red";
            playerH2.style.color = "goldenrod";
            playerScoreEl.style.color = "goldenrod";
            return true;
        }
    }

    if (playerObj.Score === 21 && playerObj.Hand.lenth === 2) {
        if (dealer.Score === 21 || dealer.Hand.length === 2) {
            messageEl.textContent = "Game is a Draw";

            let winnings = {
                Winnings: playerObj.TotalBet,
                Condition: playerObj.Name + " BlackJack Draw",
                IsWinner: true,
            };

            winningsArray.push(winnings);

            return true;
        }
    }
}

function resolvePoints(playerObj) {
    if (checkForBlackjack(playerObj)) {
        let winnings = {
            Winnings: 3.5 * playerObj.TotalBet,
            Condition: playerObj.Name + " BlackJack",
            IsWinner: true,
        };

        winningsArray.push(winnings);
        return;
    }
    if (playerObj.Score > 21) {
        let winnings = {
            Winnings: 0,
            Condition: playerObj.Name + " Player over 21",
            IsWinner: false,
        };

        winningsArray.push(winnings);

        return;
    }

    if (dealer.Score > 21) {
        let winnings = {
            Winnings: 3 * playerObj.TotalBet,
            Condition: playerObj.Name + " Dealer over 21",
            IsWinner: true,
        };

        winningsArray.push(winnings);

        return;
    }

    if (dealer.Score > playerObj.Score) {
        let winnings = {
            Winnings: 0,
            Condition: playerObj.Name + " Dealer won",
            IsWinner: false,
        };

        winningsArray.push(winnings);
    }

    if (dealer.Score < playerObj.Score) {
        let winnings = {
            Winnings: 3 * playerObj.TotalBet,
            Condition: playerObj.Name + " Player won",
            IsWinner: true,
        };

        winningsArray.push(winnings);
    }

    if (dealer.Score === playerObj.Score) {
        let winnings = {
            Winnings: playerObj.TotalBet,
            Condition: playerObj.Name + " Game was a draw",
            IsWinner: true,
        };

        winningsArray.push(winnings);
    }
}

function getWinnings() {
    let winnings = 0;
    winningsArray.forEach((element) => {
        winnings += element.Winnings;
        console.log(element.Winnings);
    });
    console.log(winnings);
    return winnings;
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
    if (player.TotalBet > player.Credit) {
        doubleBtn.disabled = true;
    }
    splitBtn.hidden = false;
    splitBtn.disabled = true;

    if (player.TotalBet < player.Credit && player.Hand[0].Value === player.Hand[1].Value) {
        splitBtn.disabled = false;
    }

    messageEl.textContent = "Pick a move";
    messageEl.style.color = "whitesmoke";
    playerScoreEl.textContent = player.Score;
    dealerScoreEl.textContent = dealer.InitialScore;
}

function makeBet() {
    removeChipElements();

    makeBetBtn.hidden = true;
    undoBetBtn.hidden = true;
    resetBetBtn.hidden = true;

    playerBetEl.textContent = "Bet: " + player.TotalBet + "$";

    messageEl.style.textAlign = "center";
    messageEl.style.width = "100%";

    playGame();
}

function startGame() {
    winningsArray.length = 0;
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
    document.querySelector(".player-div").style.borderColor = "rgba(105, 0, 0, 0.795)";

    playerH2.textContent = player.Name;

    playerCreditEl.textContent = "Credit: " + player.Credit + "$";

    messageEl.textContent = "Bet: 0$";
    messageEl.style.textAlign = "start";
    messageEl.style.width = "9ch";

    renderChips(1);
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
