import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSun } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const navigate = useNavigate();

    return (
        <Navbar bg="light" className="justify-content-between mb-2 sticky-top border-bottom">
            <Container fluid className='d-flex align-items-center justify-content-center'>
                <Navbar.Brand className='text-center' onClick={() => navigate('/Welcome')}>
                    <img
                        src="https://i.ibb.co/Rc3zJKt/Screenshot-2024-01-08-202059.png"
                        style={{ height: '50px', cursor: 'pointer' }}
                        className="d-inline-block align-top"
                        alt="Your Logo"
                    />
                </Navbar.Brand>

            </Container>
        </Navbar>
    );
};

export default Header;
