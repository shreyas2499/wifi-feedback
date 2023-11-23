import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 40.7128,
    lng: -74.0060 // Coordinates for New York City
};

function MapView() {
    const [hotspots, setHotspots] = useState([]);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        fetch('/hotspots.json')
            .then(response => response.json())
            .then(data => {console.log("Loaded hotspots:", data);
            setHotspots(data)});
    }, []);

// function MapView() {
    // const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerClassName="GoogleMap"
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
            >
                {hotspots.map((hotspot, index) => (
                    <Marker
                        key={index}
                        position={{ lat: hotspot.Latitude, lng: hotspot.Longitude }}
                        onClick={() => handleMarkerClick(hotspot)}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    )
}
function handleMarkerClick(hotspot) {
    console.log("Clicked hotspot:", hotspot.Name);
    // Here you can open a modal or form to submit a review
}



export default MapView;
