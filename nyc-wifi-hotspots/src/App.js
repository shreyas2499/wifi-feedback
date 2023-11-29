import { Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';
import HomeView from "./components/homeComponent/homeView";
import SearchView from "./components/searchComponent/searchView"
import NotFoundView from "./components/404Component/notFoundView"
import LoginPage from "./components/loginComponent/loginView"

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/search" element={<SearchView />} />
                {/* <Route path="/login" element={<LoginPage />} /> */}
                <Route path="*" element={<NotFoundView />} />
            </Routes>
        </>
    );
}

export default App;

