import React, { useState, useEffect } from "react";
import "./Blackjack.css";

const suits = ["♠", "♣", "♥", "♦"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// Create and shuffle a new deck
const createDeck = () => {
  let deck = suits.flatMap(suit =>
    values.map(value => ({ suit, value }))
  );
  return deck.sort(() => Math.random() - 0.5); // Shuffle deck
};

// Calculate hand score
const calculateScore = (hand) => {
  let score = 0;
  let aceCount = 0;

  hand.forEach(card => {
    if (card.value === "A") {
      aceCount++;
      score += 11;
    } else if (["J", "Q", "K"].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  });

  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }

  return score;
};

const Blackjack = () => {
  const [deck, setDeck] = useState(createDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState("");

  // Load game state
  useEffect(() => {
    const savedGame = localStorage.getItem("blackjack-game");
    if (savedGame) {
      const gameData = JSON.parse(savedGame);
      setBalance(gameData.balance ?? 100);
      setBet(gameData.bet ?? 10);
    }
  }, []);

  // Save game state
  useEffect(() => {
    localStorage.setItem(
      "blackjack-game",
      JSON.stringify({ balance, bet })
    );
  }, [balance, bet]);

  // Ensure deck never runs out
  const checkDeck = () => {
    if (deck.length < 15) {
      console.log("🔄 Resetting deck, cards left:", deck.length);
      setDeck(createDeck()); // Reset deck if too few cards remain
    }
  };

  // Start game
  const startGame = () => {
    if (balance <= 0) {
      setMessage("No credits left! Reset your balance.");
      return;
    }
    if (bet > balance) {
      setMessage("Not enough credits to bet!");
      return;
    }

    checkDeck(); // Ensure deck isn't empty
    const newDeck = [...deck];

    if (newDeck.length < 4) {
      console.error("🚨 Not enough cards to start game!");
      setMessage("Deck is empty! Resetting...");
      setDeck(createDeck());
      return;
    }

    const playerCards = [newDeck.pop(), newDeck.pop()];
    const dealerCards = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setPlayerScore(calculateScore(playerCards));
    setDealerScore(calculateScore(dealerCards));
    setGameOver(false);
    setMessage("");
    setBalance(balance - bet);
    setGameStarted(true);
  };

  // Player draws card
  const hit = () => {
    if (gameOver || deck.length === 0) return;

    checkDeck();
    const newDeck = [...deck];

    if (newDeck.length === 0) {
      console.error("🚨 No cards left in deck!");
      setMessage("No more cards left. Please reset.");
      return;
    }

    const newCard = newDeck.pop();
    const newHand = [...playerHand, newCard];

    setPlayerHand(newHand);
    setPlayerScore(calculateScore(newHand));
    setDeck(newDeck);

    if (calculateScore(newHand) > 21) {
      setMessage("You Busted! Dealer Wins!");
      setGameOver(true);
    }
  };

  // Dealer logic
  const stand = () => {
    if (gameOver) return;

    checkDeck();
    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];

    while (calculateScore(newDealerHand) < 17) {
      if (newDeck.length === 0) {
        console.error("🚨 No cards left for dealer!");
        setMessage("No more cards left. Please reset.");
        return;
      }
      newDealerHand.push(newDeck.pop());
    }

    const finalDealerScore = calculateScore(newDealerHand);
    setDealerHand(newDealerHand);
    setDealerScore(finalDealerScore);
    setDeck(newDeck);

    let newBalance = balance;

    if (finalDealerScore > 21 || playerScore > finalDealerScore) {
      setMessage(`You Win! +${bet * 2} credits`);
      newBalance += bet * 2;
    } else if (playerScore === finalDealerScore) {
      setMessage("It's a Draw! Bet refunded.");
      newBalance += bet;
    } else {
      setMessage("Dealer Wins!");
    }

    setBalance(newBalance);
    setGameOver(true);
    setGameStarted(false);
  };

  // Hide message after 1 second
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="blackjack-container">
      <h1>Blackjack</h1>
      <h3>Balance: {balance} credits</h3>

      <div className="betting-container">
        <label>Bet Amount:</label>
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(Math.max(1, Math.min(balance, Number(e.target.value))))}
          disabled={gameStarted}
        />
      </div>

      <h2>Dealer</h2>
      <div className="hand">
        {dealerHand.map((card, index) => (
          <span key={index} className={`card ${card.suit === "♥" || card.suit === "♦" ? "red" : ""}`}>
            {index === 1 && !gameOver ? "?" : `${card.value}${card.suit}`}
          </span>
        ))}
      </div>

      <h2>You</h2>
      <div className="hand">
        {playerHand.map((card, index) => (
          <span key={index} className={`card ${card.suit === "♥" || card.suit === "♦" ? "red" : ""}`}>
            {card.value}{card.suit}
          </span>
        ))}
      </div>

      <h3>Player Score: {playerScore}</h3>

      <div className="buttons">
        <button className="start-button" onClick={startGame}>New Game</button>
        <button className="hit-button" onClick={hit} disabled={gameOver}>Hit</button>
        <button className="stand-button" onClick={stand} disabled={gameOver}>Stand</button>
      </div>

      {balance === 0 && (
        <button className="reset-button" onClick={() => setBalance(100)}>
          Reset Balance (100 Credits)
        </button>
      )}

      {message && (
        <div className="popup">
          <div className="popup-content">
            <h2>{message}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blackjack;
