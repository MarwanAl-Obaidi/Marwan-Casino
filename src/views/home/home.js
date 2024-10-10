import React from 'react';
import './home.css';
import NavBar from '../../components/navBar/navBar';

const Home = () => {
    return (
        <div>
            <NavBar />
            <div className='homeCSS'>
                <h1>Welcome to Marwan Casino</h1>
                <p>Your favorite place to play and win!</p>
            </div>
        </div>
    );
};

export default Home;