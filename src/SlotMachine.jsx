import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import "./App.css";

const symbols = ["🍒", "🍋", "⭐", "🔔", "🍀"];

const spinSound = new Howl({ src: ["sounds/spin.mp3"] });
const winSound = new Howl({ src: ["sounds/win.mp3"] });

const SlotMachine = () => {
  const [credits, setCredits] = useState(() => {
    return localStorage.getItem("credits") ? parseInt(localStorage.getItem("credits"), 10) : 25;
  });

  const [winnings, setWinnings] = useState(() => {
    return localStorage.getItem("winnings") ? parseInt(localStorage.getItem("winnings"), 10) : 0;
  });

  const [leaderboard, setLeaderboard] = useState(() => {
    return JSON.parse(localStorage.getItem("leaderboard")) || [];
  });

  const [reels, setReels] = useState(["🍒", "🍋", "⭐"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightWin, setHighlightWin] = useState(false);
  const [winMessage, setWinMessage] = useState(""); 
  const [showTryAgain, setShowTryAgain] = useState(false);

  useEffect(() => {
    localStorage.setItem("credits", credits);
    localStorage.setItem("winnings", winnings);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }, [credits, winnings, leaderboard]);

  const updateLeaderboard = (newScore) => {
    let updatedLeaderboard = [...leaderboard, newScore];
    updatedLeaderboard = updatedLeaderboard.sort((a, b) => b - a).slice(0, 5);
    setLeaderboard(updatedLeaderboard);
  };

  const spinReels = () => {
    if (credits <= 0) {
      setShowTryAgain(true);
      return;
    }
  
    setCredits(credits - 1);
    setIsSpinning(true);
    setHighlightWin(false);
    setWinMessage("");
  
    // Resume AudioContext if needed
    if (Howler.ctx.state === "suspended") {
      Howler.ctx.resume();
    }
  
    spinSound.play(); // This now works correctly after a click
  
    setTimeout(() => {
      const newReels = reels.map(() => {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        return symbols[randomIndex];
      });
      setReels(newReels);
      setIsSpinning(false);
  
      if (newReels.every((symbol) => symbol === newReels[0])) {
        const winAmount = 5;
        setCredits(credits + winAmount);
        setWinnings(winnings + winAmount);
        setHighlightWin(true);
        winSound.play(); // This now works correctly after a click
        setWinMessage(`Congratulations! You won ${winAmount} credits!`);
  
        setTimeout(() => {
          setWinMessage("");
        }, 3000);
      }
    }, 2000);
  };
  

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
              y: isSpinning ? [0, -50, -100, -150, -200, 0] : 0,
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

      {winMessage && (
        <div className="win-alert">
          <div className="win-alert-content">
            <p>{winMessage}</p>
          </div>
        </div>
      )}

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

      <div className="leaderboard">
        <h2>🏆 Leaderboard</h2>
        <ol>
          {leaderboard.length > 0 ? (
            leaderboard.map((score, index) => (
              <li key={index}>🎉 {score} credits</li>
            ))
          ) : (
            <p>No high scores yet!</p>
          )}
        </ol>
      </div>
    </div>
  );
};

export default SlotMachine;
