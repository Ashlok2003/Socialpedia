//! List down the Overzone of followers & following and add search filter effect ?
import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

const FollowData = ({ value, setValue, followData = {} }) => {

    const { text, data } = followData;
    console.log(data);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const offCanvasStyles = {
        position: 'fixed',
        bottom: '0',
        left: isMobile ? '0%' : '70%',
        width: isMobile ? '100%' : '29%',
        height: isMobile ? '80%' : '100%',
        zIndex: 1000,
        backgroundColor: '#fff',
        transform: value ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease-in-out',
    };

    return (
        <Container>
            <Row>
                <Col lg={6} className='d-flex align-items-center justify-content-center'>
                    <div style={offCanvasStyles} className='shadow rounded-3 p-2'>
                        <h5 className="fw-bolder text-center mt-2">{text} ✌️</h5>
                        <input className='border-black form-control py-3' placeholder='Search' />

                        <div className="mt-2">
                            {
                                data && data.map((x, i) => (
                                    <Col key={i} lg={12} className='d-flex align-items-center justify-content-between px-3 py-2'
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            <img src={x?.avatarImage} alt="" style={{ width: '30px' }} />
                                            <span className='fw-bolder ms-3'>{x?.name}</span>
                                        </div>
                                        <Button variant='outline-dark' className='rounded-0 me-2'>Following</Button>
                                    </Col>
                                ))
                            }
                        </div>
                    </div>

                </Col>
            </Row>
        </Container>
    )
}

export default FollowData