import React, { useState } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import "./App.css";

// Slot machine symbols
const symbols = ["🍒", "🍋", "⭐", "🔔", "🍀"];

// Sound effects
const spinSound = new Howl({ src: ["/sounds/spin.mp3"] });
const winSound = new Howl({ src: ["/sounds/win.mp3"] });

const App = () => {
  const [reels, setReels] = useState(["🍒", "🍋", "⭐"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightWin, setHighlightWin] = useState(false);
  const [credits, setCredits] = useState(25);
  const [winnings, setWinnings] = useState(0);
  const [winMessage, setWinMessage] = useState(""); 
  const [showTryAgain, setShowTryAgain] = useState(false);

  // Spin reels with sound and animation
  const spinReels = () => {
    if (credits <= 0) {
      setShowTryAgain(true); 
      return;
    }

    // Deduct 1 credit, start spinning, and play sound
    setCredits(credits - 1);
    setIsSpinning(true);
    setHighlightWin(false); 
    setWinMessage(""); 
    spinSound.play();

    // Simulate spinning delay
    setTimeout(() => {
      const newReels = reels.map(() => {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        return symbols[randomIndex];
      });
      setReels(newReels);
      setIsSpinning(false);

      // Check win condition
      if (newReels.every((symbol) => symbol === newReels[0])) {
        const winAmount = 5;
        setCredits(credits + winAmount);
        setWinnings(winnings + winAmount);
        setHighlightWin(true); 
        winSound.play();
        setWinMessage(`Congratulations! You won ${winAmount} credits!`); 

        // Automatically hide the win message after 3 seconds
        setTimeout(() => {
          setWinMessage(""); 
        }, 3000);
      }
    }, 2000); 
  };

  // Reset the game (for "Try Again")
  const resetGame = () => {
    setCredits(25); 
    setWinnings(0);
    setShowTryAgain(false); 
  };

  return (
    <div className="App">
      <h1>Slot Machine</h1>
      <div>
        <p>Credits: {credits}</p>
        <p>Winnings: {winnings}</p>
      </div>
      <div className={`reels ${highlightWin ? "highlight" : ""}`}>
        {reels.map((symbol, index) => (
          <motion.div
            key={index}
            className="reel"
            animate={{
              y: isSpinning
                ? [0, -50, -100, -150, -200, 0] 
                : 0,
            }}
            transition={{
              duration: 0.5 + index * 0.2, 
              ease: "easeInOut",
              repeat: isSpinning ? Infinity : 0,
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>
      <button
        className={`spin-button ${isSpinning ? "disabled" : ""}`}
        onClick={spinReels}
        disabled={isSpinning}
      >
        {isSpinning ? "Spinning..." : "Spin"}
      </button>

      {/* Centered Win Alert */}
      {winMessage && (
        <div className="win-alert">
          <div className="win-alert-content">
            <p>{winMessage}</p>
          </div>
        </div>
      )}

      {/* Try Again Screen */}
      {showTryAgain && (
        <div className="try-again-screen">
          <div className="try-again-content">
            <h2>You're Out of Credits!</h2>
            <button onClick={resetGame} className="reset-button">
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
