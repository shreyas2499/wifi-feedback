import React, { useState } from 'react';
import { userLogin, resetPassword } from '../../allEndPoints/router';
import { Form, FormGroup, Label, Input, Col, Row, Navbar, Nav, NavbarBrand, NavbarToggler, NavLink, Collapse, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { FaWifi } from "react-icons/fa";
import "./customNavbarView.css"

function CustomNavbarView() {
    // const [tokenVal, setToken] = useState();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginPopup, setLoginPopup] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();
        // Assuming addedReview, selectedHotspot, addReview, fetchWfi, and toggle are defined elsewhere
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": email,
                "password": password,
            })
        };

        fetch(userLogin, requestOptions)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("token", data.data["token"]);
                localStorage.setItem("email", data.data['email']);
                localStorage.setItem("admin", data.data['admin'] ? data.data["admin"] : false)
            })
            // .then(window.location.reload()); 
            .then(toggle)
    };

    const handleLogout = (event) => {
        event.preventDefault()
        localStorage.clear();
        window.location.reload();
    }

    const toggle = () => setLoginPopup(!loginPopup);


    function validatePassword(){
      if(password.length < 8){
        return false
      }
      return true
    }

    function setPasswordFunc(e) {
        setPassword(e.target.value)
        console.log(e.target.value, "pass")
    }

    function setEmailFunc(e){
        setEmail(e.target.value)
        console.log(e.target.value,"email")
    }

    return (
        <>
            <Navbar color='dark' bg="dark" variant="dark" expand="lg">
                {/* <Container> */}
                <a className="links" href="/" style={{ cursor: "pointer", color: "white" }}><FaWifi /> Wi-Fi Hotspots</a>

                <NavbarToggler aria-controls="basic-navbar-nav" />
                {/* <Collapse id="basic-navbar-nav"> */}
                <Nav className="me-auto">
                    <a className="links" style={{ cursor: "pointer", color: "white" }} href="/" >Home</a>
                    <a className="links" style={{ cursor: "pointer", color: "white" }} href="/search">Search</a>
                </Nav>
                <Nav className="ml-auto">

                    {localStorage.getItem("token") ?
                        <a className="links" onClick={(e) => handleLogout(e)} style={{ color: "white" }}>Log out</a>
                        :
                        <a className="links" onClick={toggle} style={{ cursor: "pointer", color: "white" }}>Login</a>
                    }

                </Nav>
                {/* </Collapse> */}
                {/* </Container> */}
            </Navbar>
            <Modal isOpen={loginPopup} toggle={toggle} fade="true" size='md'>
                <ModalHeader toggle={toggle}>Enter your credentials below</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label
                                for="exampleEmail"
                                sm={2}
                            >
                                Email
                            </Label>
                            <Col sm={10}>
                                <Input
                                    id="exampleEmail"
                                    name="email"
                                    placeholder="Enter your email"
                                    type="email"
                                    onChange={(e) => setEmailFunc(e)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label
                                for="examplePassword"
                                sm={2}
                            >
                                Password
                            </Label>
                            <Col sm={10}>
                                <Input
                                    id="examplePassword"
                                    name="password"
                                    placeholder="Enter the password"
                                    type="password"
                                    onChange={(e) => setPasswordFunc(e)}
                                />
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={(e) => handleLogin(e)}>
                        Login
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default CustomNavbarView;