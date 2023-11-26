import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getWifiList, addReview, checkUniqueness, addWifiEndpoint } from "../../allEndPoints/router"

import { ToastBody, ToastHeader, Alert, Row, Col, Form, Button, Modal, ModalBody, ModalFooter, ModalHeader, Input, Table, Card, CardBod, CardTitle, CardBody, CardSubtitle, CardLink, CardText, Toast } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CustomNavbarView from "../customNavbarComponent/customNavbarView"


const containerStyle = {
    width: '100%',
    height: '100vh'
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

    const [newLat, setnewLat] = useState(0);
    const [newLong, setNewLong] = useState(0);
    const [addWifi, setAddWifi] = useState(false);
    const [newWifiName, setNewWifi] = useState("");
    const [newProv, setNewProv] = useState("");
    const [newBoro, setNewBoro] = useState("");
    const [newWifiID, setNewWifiID] = useState("");
    const [toastOpen, setToastOpen] = useState(false);

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


    function getClickedPoints(ev) {
        setnewLat(ev.latLng.lat())
        setNewLong(ev.latLng.lng())
        console.log("latitide = ", ev.latLng.lat());
        console.log("longitude = ", ev.latLng.lng());
        toggleNew();
    }

    function addNewWifi() {
        console.log(newWifiID)
        let admin = localStorage.getItem('admin')
        if(admin == "false"){
            alert("User not authorised to add wifis")
            return
        }
        if (newWifiName !== '' && newWifiID !== "" && newProv !== "" && newBoro !== "" && newLat != "" && newLong !== "") {
            fetch(checkUniqueness + "?id=" + newWifiID, {
                method: "GET"
            })
                .then(response => response.json())
                .then(data => {
                    if (data['unique']) {
                        const requestOptions = {
                            method: "POST",
                            body: JSON.stringify({
                                "wifiName": newWifiName,
                                "wifiID": newWifiID,
                                "provider": newProv,
                                "borough": newBoro,
                                "latitude": newLat,
                                "longitude": newLong,
                                "admin": true // Change this based on the atz
                            })
                        }

                        fetch(addWifiEndpoint, requestOptions)
                            .then(response => response.json())
                            .then(data => {
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
                                        toggleNew()
                                    });
                            });
                    }
                });

        }
        else {
            alert("One or more missing fields")
            // setToastOpen(true);
            // // setTimeout(() => setToastOpen(false), 3000);
        }
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

    function setWifiNameValue(e) {
        setNewWifi(e.target.value);
    }

    function setWifiIDValue(e) {
        console.log(e.target.value)
        setNewWifiID(e.target.value);
    }

    function setProviderValue(e) {
        setNewProv(e.target.value)
    }

    function setBoroughValue(e) {
        setNewBoro(e.target.value)
    }


    const toggle = () => setReviewPopup(!reviewPopup);

    const toggleNew = () => setAddWifi(!addWifi);

    return (
        <>
            {/* <CustomNavbarView/> */}
            <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                    mapContainerClassName="GoogleMap"
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onClick={ev => getClickedPoints(ev)}
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



            <Modal isOpen={addWifi} toggle={toggleNew} fade="true" size='lg'>
                <ModalHeader toggle={toggleNew}>Hello, Admin! Enter the new Wifi details below</ModalHeader>
                <ModalBody>


                    <Form>
                        <Row>
                            <Col md={6}>
                                <Input onChange={(e) => setWifiNameValue(e)} placeholder='Enter the wifi name' />
                            </Col>
                            <Col md={6}>
                                <Input onChange={(e) => setWifiIDValue(e)} placeholder='Enter a unique wifi ID' />
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col md={6}>
                                <Input disabled value={"Lat: " + newLat} />
                            </Col>
                            <Col md={6}>
                                <Input disabled value={"Long: " + newLong} />
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col md={6}>
                                <Input onChange={(e) => setProviderValue(e)} placeholder='Enter the name of the Provider' />
                            </Col>
                            <Col md={6}>
                                <Input onChange={(e) => setBoroughValue(e)} placeholder='Enter the Borough' />
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addNewWifi}>
                        Submit
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleNew}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
            {/* <ToastContainer /> */}
            {/* <Toast isOpen={toastOpen} style={{ zIndex: 100 }}>
                <ToastHeader icon="danger">
                One or more fields are missing.
                </ToastHeader>
                <ToastBody>
                    asda
                </ToastBody>
            </Toast> */}
        </>

    )
}

