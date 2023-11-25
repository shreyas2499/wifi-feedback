import React, { useState, useEffect } from 'react';
import MapView from '../MapView';
import { Routes, Route } from 'react-router-dom';

export default function HomeView() {
    return (
        <>
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
        </>

    )
}

