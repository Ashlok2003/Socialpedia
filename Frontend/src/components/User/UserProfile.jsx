import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignsPost, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../../store/Authentication/authSlice';
import { useMediaQuery } from 'react-responsive';

const UserProfile = () => {

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const userData = useSelector(selectCurrentUser);

    const navigate = useNavigate();

    return userData ? <Container fluid>
        <Row>
            <Col lg={12}>
                <Row className='mt-5 d-flex align-items-center justify-content-between'>
                    <Col sm={4} className='text-center'>
                        <img
                            src={userData?.avatarImage}
                            alt="User Profile"
                            className={`img-fluid  rounded-circle ${isMobile ? 'w-25' : 'w-50'}`}
                        />
                        <h6 className='fw-bolder fs-4'>{userData?.name}</h6>
                    </Col>
                    <Col sm={8} className='d-flex align-items-center justify-content-between py-2 border-bottom'>
                        <Col className='d-flex flex-column text-center me-3'>
                            <h4 className='fw-bolder'>Posts</h4>
                            <h6>0</h6>
                        </Col>
                        <Col className='d-flex flex-column text-center me-3'>
                            <h4 className='fw-bolder'>Followers</h4>
                            <h6>{userData?.followers.length}</h6>
                        </Col>
                        <Col className='d-flex flex-column text-center'>
                            <h4 className='fw-bolder'>Following</h4>
                            <h6>{userData?.following.length}</h6>
                        </Col>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col className='border-top border-bottom py-3'>
                        <h6 className='fw-bolder text-decoration-underline link-offset-3 mb-3'>Hello People !</h6>
                        {userData?.bio}
                    </Col>
                </Row>
                <Row className='d-flex justify-content-center border-bottom py-3'>
                    <Button variant='dark' className='fw-bolder rounded-0'>
                        Follow&nbsp;<FontAwesomeIcon icon={faUserPlus} />
                    </Button>
                </Row>
            </Col>
            <Col className='vh-100'>
                <div className='text-center py-2 border-bottom'>
                    <h6 className='fw-bolder'>Your Posts <FontAwesomeIcon icon={faSignsPost} /></h6>
                </div>
            </Col>
        </Row >

    </Container >
        :

        <div className='text-center'>
            <img src='https://i.ibb.co/0c5T6fm/image.png' className='img-fluid'
                onClick={() => navigate('/registration')}
            />
        </div>
};

export default UserProfile;
