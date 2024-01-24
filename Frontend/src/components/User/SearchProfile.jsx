import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignsPost, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import axios from '../../api/fetchUser';
import useAxiosFunction from '../../hooks/useAxiosFunction';
import { useGetPostsByUserIdQuery } from '../../store/Posts/PostSliceRedux';
import { useGetUserByIdQuery, useUpdateUserFollowingMutation } from '../../store/Users/UserSliceRedux';
import { selectCurrentUser } from '../../store/Authentication/authSlice';
import FollowData from './FollowData';

const SearchProfile = () => {

    const { username, userId } = useParams();
    const { currentData: response, isLoading, error, refetch } = useGetUserByIdQuery(userId);

    const currentUser = useSelector(selectCurrentUser);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const navigate = useNavigate();

    const { data: posts } = useGetPostsByUserIdQuery(username);

    const [handleFollow] = useUpdateUserFollowingMutation();

    const updateFollow = async () => {
        try {
            const responseData = await handleFollow({
                id: currentUser._id, userId,
                name: response.name, email: response.email,
                avatarImage: response.avatarImage
            }).unwrap();

            refetch();
        } catch (error) {
            console.log(error);
        }
    }

    return isLoading ? <div>Loading....</div>
        :
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-center flex-column'>
                    <Col lg={6}>
                        <Row className='mt-5 d-flex align-items-center justify-content-between'>
                            <Col sm={4} className='text-center'>
                                <img
                                    src={response?.avatarImage}
                                    alt="User Profile"
                                    className={`img-fluid  rounded-circle ${isMobile ? 'w-25' : 'w-50'}`}
                                />
                                <h6 className='fw-bolder fs-4'>{response?.name}</h6>
                            </Col>
                            <Col sm={8} className='d-flex align-items-center justify-content-between py-2 border-bottom'>
                                <Col className='d-flex flex-column text-center me-3'>
                                    <h4 className='fw-bolder'>Posts</h4>
                                    <h6>{posts?.length}</h6>
                                </Col>
                                <Col className='d-flex flex-column text-center me-3'>
                                    <h4 className='fw-bolder'>Followers</h4>
                                    <h6 className='fw-bolder'>{response?.followers?.length}</h6>
                                </Col>
                                <Col className='d-flex flex-column text-center'>
                                    <h4 className='fw-bolder'>Following</h4>
                                    <h6 className='fw-bolder'>{response?.following?.length}</h6>
                                </Col>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col className='border-top border-bottom py-3'>
                                <h6 className='fw-bolder text-decoration-underline link-offset-3 mb-3'>Hello People !</h6>
                                {response?.bio}
                            </Col>
                        </Row>
                        <Row className='d-flex justify-content-center border-bottom py-3'>

                            {
                                currentUser?._id !== response?._id &&
                                <Button variant={response?.followers.some(x => x.id === currentUser?._id) ? 'light' : 'dark'} className='fw-bolder rounded-0'
                                    onClick={updateFollow}
                                >
                                    {response?.followers.some(x => x.id === currentUser?._id) ? 'Following' : 'Follow'}&nbsp;<FontAwesomeIcon icon={faUserPlus} />
                                </Button>
                            }
                        </Row>
                    </Col>
                    <Col lg={6} className='' style={{ marginBottom: '40vh' }}>
                        <div className='text-center py-2 border-bottom'>
                            <h6 className='fw-bolder'>Users Posts <FontAwesomeIcon icon={faSignsPost} /></h6>
                        </div>


                        <div className='d-flex flex-wrap mt-2' onClick={() => navigate(`/UserPosts/${username}`)}>
                            {posts && posts?.map((x, i) => (
                                <div key={i} className='img-container col-lg-2 col-md-2 mx-1' style={{ cursor: 'pointer' }}>
                                    <img src={x.imagePath} alt={'userImage'} style={{ height: '120px' }} />
                                </div>
                            ))}

                        </div>

                    </Col>
                </Row >

            </Container >
        </>

};

export default SearchProfile;
