import React from 'react';
import './App.css';
import MapView from './components/MapView';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>NYC Wi-Fi Hotspots Explorer</h1>
            </header>
            <main>
                <MapView />
            </main>
            <footer>
                <p>© 2023 NYC Wi-Fi Hotspots Project</p>
            </footer>
        </div>
    );
}

export default App;

