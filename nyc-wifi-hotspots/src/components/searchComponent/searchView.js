import React, { useState, useEffect } from 'react';
import { Form, Row, Col, FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Input, Table, Card, CardBod, CardTitle, CardBody, CardSubtitle, CardLink, CardText } from 'reactstrap';
import { getWifiList } from "../../allEndPoints/router"
import "./searchView.css"
import Caret from "../iconsComponent/caretDown"
import CustomNavbarView from "../customNavbarComponent/customNavbarView"

export default function SearchView() {
    const [hotspots, setHotspots] = useState([]);
    const [order, setOrder] = useState("ASC");
    const [idSort, setIdSort] = useState(null)
    const [nameSort, setNameSort] = useState(null)
    const [provSort, setProvSort] = useState(null)
    const [borSort, setBorSort] = useState(null)
    const [reviewPopup, setReviewPopup] = useState(false);
    const [selectedHotspot, setSelectedHotspot] = useState([]);
    const [wifiIDFilter, setWifiID] = useState("");
    const [wifiName, setWifiName] = useState("");
    const [wifiBorough, setBorough] = useState("");
    const [wifiProvider, setProvider] = useState("");

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

    const sorting = (col) => {
        if (col == "wifiID") {
            setIdSort(!idSort)
            setNameSort(false)
            setProvSort(false)
            setBorSort(false)
        }
        else if (col == "wifiName") {
            setIdSort(false)
            setNameSort(!nameSort)
            setProvSort(false)
            setBorSort(false)
        }
        else if (col == "provider") {
            setIdSort(false)
            setNameSort(false)
            setProvSort(!provSort)
            setBorSort(false)
        }
        else if (col == "boroughName") {
            setIdSort(false)
            setNameSort(false)
            setProvSort(false)
            setBorSort(!borSort)
        }


        if (order === "ASC") {
            const sorted = [...hotspots].sort((a, b) =>
                a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
            )
            setHotspots(sorted);
            setOrder("DSC");
        }
        if (order === "DSC") {
            const sorted = [...hotspots].sort((a, b) =>
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


    function id(e){
        setWifiID(e.target.value)
    }

    function name(e){   
        setWifiName(e.target.value)
    }
    
    function borough(e){
        setBorough(e.target.value)
    }

    function provider(e){
        setProvider(e.target.value)
    }


    function submitFilter(){
        const requestOptions = {
            method: "POST", 
            body: JSON.stringify({
              "wifiName": wifiName,
              "wifiID": wifiIDFilter,
              "provider": wifiProvider,
              "borough": wifiBorough
            })
        }

        fetch(getWifiList, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("Loaded hotspots:", data);
                setHotspots(data.data)
            });
    }

    return (
        <>
           <CustomNavbarView/>
            <div className='container addedStyles' style={{border: "1px solid!important", marginTop: "10px!important", marginBottom: "10px!important"}}>
                <Form style={{marginTop: "15px", marginBottom: "15px"}}>
                    <Row>
                        <Col md={2}>
                            <FormGroup>
                                <Label for="wifiID">
                                    WifiID
                                </Label>
                                <Input
                                    id="wifiID"
                                    name="wifiID"
                                    placeholder="Enter an ID..."
                                    type="text"
                                    onChange={(e) => id(e)}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="wifiName">
                                    Wifi name
                                </Label>
                                <Input
                                    id="wifiName"
                                    name="wifiName"
                                    placeholder="Enter a wifi name..."
                                    type="text"
                                    onChange={(e) => name(e)}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="boroughName">
                                    Borough
                                </Label>
                                <Input
                                    id="boroughName"
                                    name="boroughName"
                                    placeholder="Enter a Borough..."
                                    type="text"
                                    onChange={(e) => borough(e)}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="provider">
                                    Provider
                                </Label>
                                <Input
                                    id="provider"
                                    name="provider"
                                    placeholder="Enter the Provider name..."
                                    type="text"
                                    onChange={(e) => provider(e)}
                                />
                            </FormGroup>
                        </Col>

                        <Col md={6}>
                            <FormGroup>
                                <Label for="search">
                                    {/* Provider */}
                                </Label>
                                <br />
                                <Button style={{marginTop: "2%"}} onClick={() => submitFilter()}  color="success">
                                    Search
                                </Button>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </div>

            <div className="container">
                <Table bordered hover striped>
                    <thead>
                        <tr>
                            <th className='cursorStyle'>
                                Sl. No
                            </th>
                            <th className="cursorStyle" onClick={() => sorting("wifiID")}>
                                WifiID <Caret direction={idSort ? "desc" : "asc"} />
                            </th>
                            <th className="cursorStyle" onClick={() => sorting("wifiName")}>
                                Wifi Name <Caret direction={nameSort ? "desc" : "asc"} />
                            </th>
                            <th className="cursorStyle" onClick={() => sorting("provider")}>
                                Provider <Caret direction={provSort ? "desc" : "asc"} />
                            </th>
                            <th className="cursorStyle" onClick={() => sorting("boroughName")}>
                                Borough <Caret direction={borSort ? "desc" : "asc"} />
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
                                            {new Date(rev.datetime).toLocaleString()}
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
