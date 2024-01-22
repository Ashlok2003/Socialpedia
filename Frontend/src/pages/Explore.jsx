import { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Search from '../components/inputs/Search';

function Explore() {

    return (
        <Container className='mt-4' style={{ height: '85vh' }}>
            <Row className='d-flex justify-content-center'>
                <Col lg={8}>
                   <Search />
                </Col>
                <Col lg={12}>
                    
                </Col>
            </Row>
        </Container>
    )
}

export default Explore