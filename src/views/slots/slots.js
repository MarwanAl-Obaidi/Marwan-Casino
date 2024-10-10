import React, { useState } from 'react';
import './slots.css';
import NavBar from '../../components/navBar/navBar.js';

const Slots = () => {
    const slotItems = ['🍒', '🍋', '🍊', '🍇', '🍉'];

    const [slots, setSlots] = useState(['🍒', '🍒', '🍒']);
    const [message, setMessage] = useState('');

    const spinSlots = () => {
        const newSlots = Array.from({ length: 3 }, () =>
            slotItems[Math.floor(Math.random() * slotItems.length)]
        );
        setSlots(newSlots);

        if (newSlots.every((slot) => slot === newSlots[0])) {
            setMessage('🎉 Jackpot! You won! 🎉');
        } else {
            setMessage('Try Again!');
        }
    };

    return (
        <div>
            <NavBar />
            <div className="slot-machine">
                <h1>Slot Machine</h1>
                <div className="slots">
                    {slots.map((slot, index) => (
                        <div key={index} className="slot">
                            {slot}
                        </div>
                    ))}
                </div>
                {message && <p className="message">{message}</p>}
                <button className="spin-button" onClick={spinSlots}>
                    Spin
                </button>
            </div>
        </div>
    );
};

export default Slots;
