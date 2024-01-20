import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSun } from '@fortawesome/free-solid-svg-icons';


const Header = () => {
    return (
        <Navbar bg="light" className="justify-content-between mb-2 sticky-top border-bottom">
            <Container fluid>
                <Navbar.Brand href="#home">
                    <img
                        src="https://i.ibb.co/Rc3zJKt/Screenshot-2024-01-08-202059.png"
                        style={{width: '130px'}}
                        className="d-inline-block align-top"
                        alt="Your Logo"
                    />
                </Navbar.Brand>
                <Nav>
                    <Nav.Link href="#notifications">
                        <FontAwesomeIcon icon={faBell} className="fs-4 text-dark" />
                    </Nav.Link>
                    
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;
