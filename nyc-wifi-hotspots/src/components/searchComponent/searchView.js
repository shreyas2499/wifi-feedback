import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Input, Table, Card, CardBod, CardTitle, CardBody, CardSubtitle, CardLink, CardText } from 'reactstrap';
import { getWifiList } from "../../allEndPoints/router"
import "./searchView.css"
import Caret from "../iconsComponent/caretDown"

export default function SearchView() {
    const [hotspots, setHotspots] = useState([]);
    const [order, setOrder] = useState("ASC");
    const [idSort, setIdSort] = useState(null)
    const [nameSort, setNameSort] = useState(null)
    const [provSort, setProvSort] = useState(null)
    const [borSort, setBorSort] = useState(null)
    const [reviewPopup, setReviewPopup] = useState(false);
    const [selectedHotspot, setSelectedHotspot] = useState([]);
    const [addedReview, setAddedReview] = useState("");

    useEffect(() => {
        fetch(getWifiList, {
            method: "GET",
        })
            .then(response => response.json())
            .then(data => {
                console.log("Loaded hotspots:", data);
                setHotspots(data.data)
            });
    }, []);

    const sorting = (col) => {
        if(col == "wifiID"){
            setIdSort(!idSort)
            setNameSort(false)
            setProvSort(false)
            setBorSort(false)
        }
        else if(col =="wifiName"){
            setIdSort(false)
            setNameSort(!nameSort)
            setProvSort(false)
            setBorSort(false)
        }
        else if(col =="provider"){
            setIdSort(false)
            setNameSort(false)
            setProvSort(!provSort)
            setBorSort(false)
        }
        else if(col =="boroughName"){
            setIdSort(false)
            setNameSort(false)
            setProvSort(false)
            setBorSort(!borSort)
        }


        if (order === "ASC"){
            const sorted = [...hotspots].sort((a,b) => 
                a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
            )
            setHotspots(sorted);
            setOrder("DSC");
        }
        if (order === "DSC"){
            const sorted = [...hotspots].sort((a,b) => 
                a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
            )
            setHotspots(sorted);
            setOrder("ASC");
        }
    }

    function handleMarkerClick(hotspot) {
        setReviewPopup(false);
        console.log("Clicked hotspot:", hotspot);
        setSelectedHotspot(hotspot);
        toggle();
    }

    const toggle = () => setReviewPopup(!reviewPopup);

    return (
        <>
            <header className="App-header">
                <h1>NYC Wi-Fi Hotspots Explorer</h1>
            </header>

            <div className='container'>

            </div>

            <div className="container"> 
                <Table bordered hover striped>
                    <thead>
                        <tr>
                            <th className='cursorStyle'>
                                Sl. No
                            </th>
                            <th className="cursorStyle" onClick={() => sorting("wifiID")}>
                                WifiID <Caret direction={idSort? "desc" : "asc"}/>
                            </th>
                            <th className="cursorStyle" onClick={() => sorting("wifiName")}>
                                Wifi Name <Caret direction={nameSort? "desc" :"asc"}/>
                            </th>
                            <th className="cursorStyle" onClick={() => sorting("provider")}>
                                Provider <Caret direction={provSort? "desc" : "asc"}/>
                            </th>
                            <th className="cursorStyle" onClick={() => sorting("boroughName")}>
                                Borough <Caret direction={borSort? "desc": "asc"}/>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotspots.map((hotspot, index) => (
                            <tr scope="row" onClick={() => handleMarkerClick(hotspot)}>
                                <td>
                                    {index + 1}
                                </td>
                                <td>
                                    {hotspot.wifiID}
                                </td>
                                <td>
                                    {hotspot.wifiName}
                                </td>
                                <td>
                                    {hotspot.provider}
                                </td>
                                <td>
                                    {hotspot.boroughName}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <Modal isOpen={reviewPopup} toggle={toggle} fade="true" size='lg'>
                <ModalHeader toggle={toggle}>Add a review for: {selectedHotspot.wifiName}</ModalHeader>
                <ModalBody>
                    <div className='container' style={{ maxHeight: "250px", overflowY: "scroll", marginBottom: "15px" }}>
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
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>


        </>
    )
}
