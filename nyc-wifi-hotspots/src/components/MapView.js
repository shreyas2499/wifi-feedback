import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getWifiList, addReview } from "../allEndPoints/router"

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Input, Table, Card, CardBod, CardTitle, CardBody, CardSubtitle, CardLink, CardText } from 'reactstrap';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 40.7128,
    lng: -74.0060 // Coordinates for New York City
};

export default function MapView() {
    const [hotspots, setHotspots] = useState([]);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const [reviewPopup, setReviewPopup] = useState(false);
    const [selectedHotspot, setSelectedHotspot] = useState([]);
    const [addedReview, setAddedReview] = useState("");

    useEffect(() => {
        const requestOptions = {
            method: "POST", 
            body: JSON.stringify({
              "wifiName": "",
              "wifiID": "",
              "provider": "",
              "borough": ""
            })
        }

        fetch(getWifiList, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("Loaded hotspots:", data);
                setHotspots(data.data)
            });
    }, []);


    function handleMarkerClick(hotspot) {
        setReviewPopup(false);
        console.log("Clicked hotspot:", hotspot);
        setSelectedHotspot(hotspot);
        toggle();
    }

    function enterReview(e) {
        console.log(e.target.value, "asdas")
        setAddedReview(e.target.value);
    }

    function fetchWfi() {
        const requestOptions = {
            method: "POST", 
            body: JSON.stringify({
              "wifiName": "",
              "wifiID": "",
              "provider": "",
              "borough": ""
            })
        }

        fetch(getWifiList, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("Loaded hotspots:", data);
                setHotspots(data.data)
            });
    }


    function addReviewToDB() {
        if (addedReview != "") {
            const requestOptions = {
                method: "POST",
                body: JSON.stringify({
                    "review": addedReview,
                    "wifiName": selectedHotspot.wifiName,
                    "wifiID": selectedHotspot.wifiID,
                    "user": "shreyas@gmail.com",     // Needs to be updated once the login part is done
                    "lat": selectedHotspot.latitude,
                    "long": selectedHotspot.longitude,
                    "provider": selectedHotspot.provider,
                    "borough": selectedHotspot.borough
                })
            }

            fetch(addReview, requestOptions)
                .then(response => response.json())
                .then(fetchWfi)
                .then(toggle)

        }
    }

    const toggle = () => setReviewPopup(!reviewPopup);

    return (
        <>
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
                            position={{ lat: parseFloat(hotspot.latitude), lng: parseFloat(hotspot.longitude) }}
                            onClick={() => handleMarkerClick(hotspot)}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
            <Modal isOpen={reviewPopup} toggle={toggle} fade="true" size='lg'>
                <ModalHeader toggle={toggle}>Add a review for: {selectedHotspot.wifiName}</ModalHeader>
                <ModalBody>
                    {/* <div className='container' style={{ maxHeight: "250px", overflowY: "scroll", marginBottom: "15px" }}>
                        {selectedHotspot['reviews'] && selectedHotspot['reviews'].length > 0 ? (
                            selectedHotspot['reviews'].map((rev, index) => (

                                <Card style={{ width: '100%', marginBottom: "10px" }}>
                                    <CardBody>
                                        <CardTitle tag="h5">
                                            {rev.review}
                                        </CardTitle>
                                    </CardBody>
                                    <CardBody>
                                        <CardText>
                                            {rev.user}<br />
                                            {rev.datetime}
                                        </CardText>
                                    </CardBody>
                                </Card>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No reviews available.</td>
                            </tr>
                        )}
                    </div> */}

                    <Input onChange={(e) => enterReview(e)} type="textarea" placeholder='Enter your review...' />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addReviewToDB}>
                        Submit
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </>

    )
}

