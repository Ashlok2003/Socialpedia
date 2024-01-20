import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { Container, Row, Col } from 'react-bootstrap';

export default function Registration() {

    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = (event) => {
        event.preventDefault();
        setIsFlipped(!isFlipped);
    }

    return (
        <Container className='mt-3'>
            <Row className='d-flex justify-content-center'>

                <Col lg={4} className='mt-5'>
                    <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
                        <div className='px-2'>
                            <Login functionality={handleClick} />
                        </div>

                        <div className=''>
                            <Signup functionality={handleClick} />
                        </div>

                    </ReactCardFlip>
                </Col>

            </Row>
        </Container>
    )
}