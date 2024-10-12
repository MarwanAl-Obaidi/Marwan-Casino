import React, { useState } from 'react';

const Baccarat = () => {
    const [playerHand, setPlayerHand] = useState([]);
    const [bankerHand, setBankerHand] = useState([]);
    const [playerScore, setPlayerScore] = useState(0);
    const [bankerScore, setBankerScore] = useState(0);
    const [gameResult, setGameResult] = useState('');
    const [bet, setBet] = useState(''); // 'Player', 'Banker', or 'Tie'
    const [message, setMessage] = useState('');

    // Card deck
    const getCard = () => {
        const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0]; // 10, J, Q, K = 0
        return cards[Math.floor(Math.random() * cards.length)];
    };

    // Helper function to calculate the score of a hand
    const calculateScore = (hand) => {
        const total = hand.reduce((acc, card) => acc + card, 0);
        return total % 10; // Last digit of the sum
    };

    // Draws an initial hand twicce
    const drawInitialHand = () => [getCard(), getCard()];

    // Third card rule for the Player
    const shouldPlayerDrawThirdCard = (playerScore) => playerScore <= 5;

    // Third card rule for the Banker
    const shouldBankerDrawThirdCard = (bankerScore, playerThirdCard) => {
        if (bankerScore <= 2) return true;
        if (bankerScore === 3 && playerThirdCard !== 8) return true;
        if (bankerScore === 4 && [2, 3, 4, 5, 6, 7].includes(playerThirdCard)) return true;
        if (bankerScore === 5 && [4, 5, 6, 7].includes(playerThirdCard)) return true;
        if (bankerScore === 6 && [6, 7].includes(playerThirdCard)) return true;
        return false;
    };

    const playGame = () => {
        if (!bet) {
            setMessage('Please place a bet on Player, Banker, or Tie.');
            return;
        }

        // Reset message and game result
        setMessage('');
        setGameResult('');

        // Deal initial hands
        const initialPlayerHand = drawInitialHand();
        const initialBankerHand = drawInitialHand();

        // Calculate initial scores
        let playerTotal = calculateScore(initialPlayerHand);
        let bankerTotal = calculateScore(initialBankerHand);

        // Determine if a third card is needed for the Player
        let playerThirdCard = null;
        if (shouldPlayerDrawThirdCard(playerTotal)) {
            playerThirdCard = getCard();
            initialPlayerHand.push(playerThirdCard);
            playerTotal = calculateScore(initialPlayerHand);
        }

        // Determine if a third card is needed for the Banker
        if (shouldBankerDrawThirdCard(bankerTotal, playerThirdCard)) {
            const bankerThirdCard = getCard();
            initialBankerHand.push(bankerThirdCard);
            bankerTotal = calculateScore(initialBankerHand);
        }

        // Update state with new hands and scores
        setPlayerHand(initialPlayerHand);
        setBankerHand(initialBankerHand);
        setPlayerScore(playerTotal);
        setBankerScore(bankerTotal);

        // Determine the game result
        if (playerTotal > bankerTotal) {
            setGameResult('Player wins!');
            if (bet === 'Player') setMessage('You win the bet!');
            else setMessage('You lose the bet!');
        } else if (bankerTotal > playerTotal) {
            setGameResult('Banker wins!');
            if (bet === 'Banker') setMessage('You win the bet!');
            else setMessage('You lose the bet!');
        } else {
            setGameResult('It\'s a Tie!');
            if (bet === 'Tie') setMessage('You win the bet!');
            else setMessage('You lose the bet!');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Baccarat Game</h1>
            <div>
                <label>
                    <input
                        type="radio"
                        value="Player"
                        checked={bet === 'Player'}
                        onChange={() => setBet('Player')}
                    />
                    Bet on Player
                </label>
                <label>
                    <input
                        type="radio"
                        value="Banker"
                        checked={bet === 'Banker'}
                        onChange={() => setBet('Banker')}
                    />
                    Bet on Banker
                </label>
                <label>
                    <input
                        type="radio"
                        value="Tie"
                        checked={bet === 'Tie'}
                        onChange={() => setBet('Tie')}
                    />
                    Bet on Tie
                </label>
            </div>
            <button onClick={playGame}>Play</button>
            <div style={{ marginTop: '20px' }}>
                <h2>Player Hand: {playerHand.join(', ')}</h2>
                <h2>Banker Hand: {bankerHand.join(', ')}</h2>
                <h3>Player Score: {playerScore}</h3>
                <h3>Banker Score: {bankerScore}</h3>
            </div>
            {gameResult && <h2>{gameResult}</h2>}
            {message && <p>{message}</p>}
        </div>
    );
};

export default Baccarat;
