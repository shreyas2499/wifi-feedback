import { Routes, Route } from 'react-router-dom';
import React from 'react';
import "./notFoundView.css"
import CustomNavbarView from "../customNavbarComponent/customNavbarView"
import { Table } from "reactstrap";

export default function NotFoundView() {
    return (
        <>
            <CustomNavbarView/> 
            <div className="not-found-container">
                <div className="not-found-content">
                    <h1>404 - Page Not Found</h1>
                    <p>Sorry, the page you are looking for might be in another universe.</p>
                </div>
            </div>
        </>
    )
}