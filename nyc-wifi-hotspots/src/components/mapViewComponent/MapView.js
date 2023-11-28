import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getWifiList, addReview, checkUniqueness, addWifiEndpoint, deleteWifiEndpoint } from "../../allEndPoints/router"

import { ToastBody, ToastHeader, Alert, Row, Col, Form, Button, Modal, ModalBody, ModalFooter, ModalHeader, Input, Table, Card, CardBod, CardTitle, CardBody, CardSubtitle, CardLink, CardText, Toast } from 'reactstrap';
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
    const [alertMessage, setAlertMessage] = useState("")
    const [visible, setVisible] = useState(false);


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
        setVisible(false)
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
        setVisible(false)
        toggleNew();
    }

    function addNewWifi() {
        if (!localStorage.getItem("token")) {
            setAlertMessage("Please login to add a review")
            setVisible(true)
            return
        }
        console.log(newWifiID)
        let admin = localStorage.getItem('admin')
        if (admin == "false") {
            setAlertMessage("User not authorised to add wifis")
            setVisible(true)
            return
        }
        if (newWifiName == '' || newWifiID == "" || newProv == "" || newBoro == "" || newLat == "" || newLong == "") {
            setAlertMessage("One or more fields missing")
            setVisible(true)
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
                                setAlertMessage("New Wifi has been added")
                                setVisible(true)
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
                                        toggleNew()
                                        setHotspots(data.data)
                                        // toggleNew()
                                    });
                            });
                    }
                });

        }
        else {
            setAlertMessage("One or more missing fields")
            setVisible(true)
            // setToastOpen(true);
            // // setTimeout(() => setToastOpen(false), 3000);
        }
    }

    function addReviewToDB() {
        setVisible(false)
        setAlertMessage("")
        if (!localStorage.getItem("token")) {
            setAlertMessage("Please login to add a review")
            setVisible(true)
            return
        }
        if (addedReview != "") {
            const requestOptions = {
                method: "POST",
                body: JSON.stringify({
                    "review": addedReview,
                    "wifiName": selectedHotspot.wifiName,
                    "wifiID": selectedHotspot.wifiID,
                    "user": localStorage.getItem("email"),     // Needs to be updated once the login part is done
                    "lat": selectedHotspot.latitude,
                    "long": selectedHotspot.longitude,
                    "provider": selectedHotspot.provider,
                    "boroughName": selectedHotspot.boroughName
                })
            }

            fetch(addReview, requestOptions)
                .then(response => response.json())
                .then(fetchWfi)
                .then(toggle)
        }
        else{
            setAlertMessage("Please add a review")
            setVisible(true)
            return
        }
    }

    function deleteWifi(){
        if (!localStorage.getItem("token")) {
            setAlertMessage("Please login to add a review")
            setVisible(true)
            return
        }
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({
                "wifiName": selectedHotspot.wifiName,
                "wifiID": selectedHotspot.wifiID,
                "user": localStorage.getItem("email"),
                "admin": localStorage.getItem("admin")
            })
        }

        fetch(deleteWifiEndpoint, requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data["message"] == "Wifi Not deleted"){
                    setAlertMessage("Wifi not deleted. Please try again later")
                    setVisible(true)
                    return
                }
                else if(data["message"] == "User doesn't have permission to delete Wifis"){
                    setAlertMessage("User doesn't have permission to delete Wifi")
                    setVisible(true)
                    return
                }
                else{
                    toggle();
                }
            })
            .then(fetchWfi)
            // .then(toggle)

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

    const onDismiss = () => setVisible(false);

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
                    <Input onChange={(e) => enterReview(e)} type="textarea" placeholder='Enter your review...' />
                    <br/>
                    <Alert color="danger" isOpen={visible} toggle={onDismiss}>
                        {alertMessage}
                    </Alert>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addReviewToDB}>
                        Submit
                    </Button>{' '}
                    {localStorage.getItem("admin") == "true" ?
                        <>
                            <Button color="danger" onClick={deleteWifi}>
                                Delete Wifi
                            </Button>{" "}
                        </>
                        :
                        <>
                        </>
                    }

                    <Button color="secondary" onClick={toggle}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>


            {localStorage.getItem('admin') == "true" ?
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
                            <Row>
                                <Alert color={alertMessage == 'New Wifi has been added' ? 'success' : 'danger'} isOpen={visible} toggle={onDismiss}>
                                    {alertMessage}
                                </Alert>
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
                :
                <></>
            }
        </>

    )
}

