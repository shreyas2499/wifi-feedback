import React, { useState, useEffect } from 'react';
import MapView from '../mapViewComponent/MapView';
import { Routes, Route } from 'react-router-dom';
import CustomNavbarView from "../customNavbarComponent/customNavbarView"

export default function HomeView() {
    return (
        <>
            <div className="App">
                <CustomNavbarView />
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