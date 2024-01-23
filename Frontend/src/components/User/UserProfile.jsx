import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignsPost, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../../store/Authentication/authSlice';
import { useMediaQuery } from 'react-responsive';
import { useGetPostsByUserIdQuery } from '../../store/Posts/PostSliceRedux';

import FollowData from './FollowData';

const UserProfile = () => {

    const [show, setShow] = useState(false);
    const [followData, setFollowData] = useState([]);

    const handleShow = () => setShow(prev => !prev);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const userData = useSelector(selectCurrentUser);

    const { data: posts, isLoading } = userData && useGetPostsByUserIdQuery(userData.name);

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
                        <Col className='d-flex flex-column text-center me-3' style={{ cursor: 'pointer' }}>
                            <h4 className='fw-bolder'>Posts</h4>
                            <h6 className='fw-bolder'>{posts?.length}</h6>
                        </Col>
                        <Col className='d-flex flex-column text-center me-3' style={{ cursor: 'pointer' }}
                            onClick={() => handleShow() && setFollowData(userData?.followers)}
                        >
                            <h4 className='fw-bolder'>Followers</h4>
                            <h6 className='fw-bolder'>{userData?.followers.length}</h6>
                        </Col>
                        <Col className='d-flex flex-column text-center' style={{ cursor: 'pointer' }}
                            onClick={() => handleShow() && setFollowData(userData?.following)}
                        >
                            <h4 className='fw-bolder'>Following</h4>
                            <h6 className='fw-bolder'>{userData?.following.length}</h6>
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
            <Col className='' style={{ marginBottom: '40vh' }}>
                <div className='text-center py-2'>
                    <h6 className='fw-bolder'>Your Posts <FontAwesomeIcon icon={faSignsPost} /></h6>
                    <div className='d-flex flex-wrap mt-2'>
                        {posts && posts?.map((x, i) => (
                            <div key={i} className='img-container col-lg-2 col-md-2 mx-2 mt-2' style={{ cursor: 'pointer' }}>
                                <img src={x.imagePath} alt={'userImage'} style={{ height: '120px' }} />
                            </div>
                        ))}

                    </div>
                </div>
            </Col>
        </Row >

        <Row>
            <FollowData value={show} setValue={setShow} data={followData} />
        </Row>

    </Container >
        :

        <div className='text-center'>
            <img src='https://i.ibb.co/0c5T6fm/image.png' className='img-fluid'
                onClick={() => navigate('/registration')}
            />
        </div>
};

export default UserProfile;
