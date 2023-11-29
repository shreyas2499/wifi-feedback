import React, { useState } from 'react';
import { userLogin, resetPasswordEndpoint, signUp } from '../../allEndPoints/router';
import { Alert, Form, FormGroup, Label, Input, Col, Row, Navbar, Nav, NavbarBrand, NavbarToggler, NavLink, Collapse, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { FaWifi } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";
import "./customNavbarView.css"

function CustomNavbarView() {
    // const [tokenVal, setToken] = useState();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginPopup, setLoginPopup] = useState("");
    const [action, setAction] = useState("login")

    // sign up values
    const [signSecQuestion, setSecurityQuestion] = useState("What was your first car?")
    const [signEmail, setSignEmail] = useState("")
    const [signPass, setSignPass] = useState("")
    const [signConfPass, setSignConfPass] = useState("")
    const [signSecAns, setSignSecAns] = useState("")



    // forgetPassword value
    const [forSecQuestion, setForSecQuestion] = useState("What was your first car?")
    const [forSecAns, setForSecAns] = useState("")
    const [forEmail, setForEmail] = useState("")
    const [forNewPass, setForNewPass] = useState("")
    const [forConfNewPass, setForConfNewPass] = useState("")


    const [alertMessage, setAlertMessage] = useState("")
    const [visible, setVisible] = useState(false);
    


    const handleLogin = () => {
        // event.preventDefault();
        // Assuming addedReview, selectedHotspot, addReview, fetchWfi, and toggle are defined elsewhere
        if (email == "" || password == "") {
            setAlertMessage("Email and password needs to be entered");
            setVisible(true)            
            return
        }

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
                if(data["message"] == "User not present"){
                    setAlertMessage("Username or password incorrect.")
                    setVisible(true)
                    return
                }
                localStorage.setItem("token", data.data["token"]);
                localStorage.setItem("email", data.data['email']);
                localStorage.setItem("admin", data.data['admin'] ? data.data["admin"] : false)
                toggle();
            })
            // .then(window.location.reload()); 
            // .then(toggle)
    };

    function handleSignUp() {
        if (signPass != signConfPass) {
            setAlertMessage("Passwords do not match")
            setVisible(true)
            return
        }
        if (signPass == "" || signConfPass == "" || signEmail == "" || signSecQuestion == "" || signSecAns == "") {
            setAlertMessage("One or more values not entered")
            setVisible(true)
            return
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": signEmail,
                "password": signPass,
                "secQues": { "q": signSecQuestion, "a": signSecAns },
                "admin": false
            })
        };

        fetch(signUp, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data, "data")
                if (data["message"] == "User already present") {
                    setAlertMessage("User is already present")
                    setVisible(true)
                    return
                }
            })
            .then(toggle)


    }


    function resetPassword() {
        if (forNewPass != forConfNewPass) {
            setAlertMessage("Passwords do not match")
            setVisible(true)
            return
        }
        if (forNewPass == "" || forConfNewPass == "" || forEmail == "" || forSecAns == "" || forSecQuestion == "") {
            setAlertMessage("One or more values not entered")
            setVisible(true)
            return
        }


        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": forEmail,
                "password": forNewPass,
                "secQues": { "q": forSecQuestion, "a": forSecAns },
                "admin": false
            })
        };

        fetch(resetPasswordEndpoint, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data, "data")
                if (data["message"] == "User not present") {
                    setAlertMessage("User not present")
                    setVisible(true)
                    return
                }
                if (data["message"] == "Wrong security answer") {
                    setAlertMessage("Wrong security answer")
                    setVisible(true)
                    return
                }
                // localStorage.setItem("token", data.data["token"]);
                // localStorage.setItem("email", data.data['email']);
                // localStorage.setItem("admin", data.data['admin'] ? data.data["admin"] : false)
            })
            // .then(window.location.reload()); 
            .then(toggle)

    }

    const handleLogout = (event) => {
        event.preventDefault()
        localStorage.clear();
        window.location.reload();
    }

    const toggle = () => setLoginPopup(!loginPopup);


    function validatePassword() {
        if (password.length < 8) {
            return false
        }
        return true
    }

    function setPasswordFunc(e) {
        setPassword(e.target.value)
        console.log(e.target.value, "pass")
    }

    function setEmailFunc(e) {
        setEmail(e.target.value)
        console.log(e.target.value, "email")
    }

    const onDismiss = () => setVisible(false);


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
                        <a className="links" onClick={(e) => handleLogout(e)} style={{ cursor: "pointer", color: "white" }}>Log out</a>
                        :
                        <a className="links" onClick={() => { toggle(); setAction("login"); setVisible(false) }} style={{ cursor: "pointer", color: "white" }}>Login</a>
                    }
                </Nav>
            </Navbar>
            <Modal isOpen={loginPopup} toggle={toggle} fade="true" size='md'>
                <ModalHeader toggle={toggle}></ModalHeader>
                <ModalBody>
                    <div className='logSign'>
                        <div className="header">
                            <div className='text'>{action === 'login' ? "Login" : action === "signUp" ? "Sign Up" : "Reset Password"}</div>
                            <div className='underline'></div>
                        </div>

                        <div className='inputs'>
                            {action === "login" ?
                                <>
                                    <div className='input'>
                                        <MdEmail className='icons' />
                                        <input type="email" placeholder='Email ID' onChange={(e) => setEmailFunc(e)} />
                                    </div>
                                    <div className='input'>
                                        <FaLock className='icons' />
                                        <input type="password" placeholder='Password' onChange={(e) => setPasswordFunc(e)} />
                                    </div>

                                    <Alert color="danger" isOpen={visible} toggle={onDismiss}>
                                        {alertMessage}
                                    </Alert>
                                </>
                                :
                                <></>
                            }
                            {action === "signUp" ?
                                <>
                                    <div className='input'>
                                        <MdEmail className='icons' />
                                        <input type="email" placeholder='Email ID' onChange={(e) => setSignEmail(e.target.value)} />
                                    </div>

                                    <Input
                                        id="exampleSelect"
                                        name="select"
                                        type="select"
                                        className='select'
                                        onChange={event => setSecurityQuestion(event.target.value)}
                                    >
                                        <option disabled>
                                            Select a security question...
                                        </option>
                                        <option value="What was your first car?">
                                            What was your first car?
                                        </option>
                                        <option value="What is your middle name?">
                                            What is your middle name?
                                        </option>
                                        <option value="What is the name of your favorite pet?">
                                            What is the name of your favorite pet?
                                        </option>
                                        <option value="What was the name of your elementary school?">
                                            What was the name of your elementary school?
                                        </option>
                                        <option value="What was your favorite food as a child?">
                                            What was your favorite food as a child?
                                        </option>
                                    </Input>

                                    <div className='input'>
                                        <FaQuestion className='icons' />
                                        <input type="texy" placeholder='Answer' onChange={(e) => setSignSecAns(e.target.value)} />
                                    </div>

                                    <div className='input'>
                                        <FaLock className='icons' />
                                        <input type="password" placeholder='Password' onChange={(e) => setSignPass(e.target.value)} />
                                    </div>


                                    <div className='input'>
                                        <FaLock className='icons' />
                                        <input type="password" placeholder='Confirm Password' onChange={(e) => setSignConfPass(e.target.value)} />
                                    </div>

                                    <Alert color="danger" isOpen={visible} toggle={onDismiss}>
                                        {alertMessage}
                                    </Alert>
                                </>
                                :
                                <></>
                            }

                            {action == "forgotPassword" ?
                                <>
                                    <div className='input'>
                                        <MdEmail className='icons' />
                                        <input type="email" placeholder='Email ID' onChange={(e) => setForEmail(e.target.value)} />
                                    </div>

                                    <Input
                                        id="exampleSelect"
                                        name="select"
                                        type="select"
                                        className='select'
                                        onChange={event => setForSecQuestion(event.target.value)}
                                    >
                                        <option disabled>
                                            Select a security question...
                                        </option>
                                        <option value="What was your first car?">
                                            What was your first car?
                                        </option>
                                        <option value="What is your middle name?">
                                            What is your middle name?
                                        </option>
                                        <option value="What is the name of your favorite pet?">
                                            What is the name of your favorite pet?
                                        </option>
                                        <option value="What was the name of your elementary school?">
                                            What was the name of your elementary school?
                                        </option>
                                        <option value="What was your favorite food as a child?">
                                            What was your favorite food as a child?
                                        </option>
                                    </Input>

                                    <div className='input'>
                                        <FaQuestion className='icons' />
                                        <input type="texy" placeholder='Answer' onChange={(e) => setForSecAns(e.target.value)} />
                                    </div>

                                    <div className='input'>
                                        <FaLock className='icons' />
                                        <input type="password" placeholder='Password' onChange={(e) => setForNewPass(e.target.value)} />
                                    </div>


                                    <div className='input'>
                                        <FaLock className='icons' />
                                        <input type="password" placeholder='Confirm Password' onChange={(e) => setForConfNewPass(e.target.value)} />
                                    </div>

                                    <Alert color="danger" isOpen={visible} toggle={onDismiss}>
                                        {alertMessage}
                                    </Alert>

                                </>
                                :
                                <></>
                            }
                        </div>
                        {action === "login" ?
                            <div className='forgot-password'>
                                Forgot Password? <span onClick={() => setAction("forgotPassword")}>Click Here!</span>
                            </div>
                            :
                            <></>
                        }
                        {action === "forgotPassword" ?
                            <>
                                <div className='submit-container'>
                                    <div className="submit" onClick={() => resetPassword()}>
                                        Reset Password
                                    </div>
                                </div>
                                <div className='back-container'>
                                    <div className="back gray" onClick={() => setAction("login")}>
                                        Back
                                    </div>
                                </div>
                            </>
                            :
                            <div className='submit-container'>
                                <div className={action === "login" ? 'submit gray' : "submit"} onClick={() => { action === "signUp" ? handleSignUp() : setAction("signUp") }}>
                                    Sign Up
                                </div>
                                <div className={action === "signUp" ? 'submit gray' : "submit"} onClick={() => { action === "login" ? handleLogin() : setAction("login") }}>
                                    Login
                                </div>

                            </div>
                        }
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}

export default CustomNavbarView;