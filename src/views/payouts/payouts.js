import React from 'react';
import NavBar from '../../components/navBar/navBar';
import './payouts.css'; // Create this CSS file for styling if needed

const Payouts = () => {
    // Payouts data for the slots
    const payouts = [
        { symbol: '🍒', three: 100, two: 20 },
        { symbol: '🍋', three: 80, two: 16 },
        { symbol: '🍊', three: 70, two: 14 },
        { symbol: '🍇', three: 50, two: 10 },
        { symbol: '🍉', three: 50, two: 10 },
    ];

    return (
        <div>
            <NavBar />
            <div className="payouts">
                <h1>Slot Machine Payouts</h1>
                <table className="payouts-table">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Three of a Kind</th>
                            <th>Two of a Kind</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payouts.map((payout, index) => (
                            <tr key={index}>
                                <td>{payout.symbol}</td>
                                <td>{payout.three}</td>
                                <td>{payout.two}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Payouts;
