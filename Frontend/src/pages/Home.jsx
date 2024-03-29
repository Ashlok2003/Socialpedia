import React from 'react'
import { Container, Row, Col, ListGroup, Accordion, Card, Button } from 'react-bootstrap'
import Posts from '../components/posts/Posts'
import AddNewPost from '../components/posts/AddNewPost'
import Suggestions from '../components/home/Suggestions';
import { useSelector } from 'react-redux';
import Header from '../components/header/Header';
import { useGetPostsQuery, selectPostIds } from '@/store/Posts/PostSliceRedux'
import Status from '../components/home/Status';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function Home() {

    const { isLoading, isSuccess } = useGetPostsQuery();
    const postIds = useSelector(selectPostIds);

    return (
        <Container fluid>

            <Row className='d-flex justify-content-between'>

                <Col lg={3} className='d-none d-lg-block border' style={{ maxHeight: '100vh' }}>
                    <img src='https://i.ibb.co/vBp82k4/4491.jpg' className='img-fluid' />
                    <h6 className='mb-2 fw-bolder text-center'>Please Maintain Guildelines 😎</h6>
                </Col>

                <Col lg={6} sm={12} className=''>

                    <Col lg={12} sm={12} className=''>
                        <Status />
                    </Col>


                    <div className="d-flex align-items-center justify-content-between">
                        <hr style={{ width: '100%', color: 'black' }} />
                        <h6 className="fw-bolder">
                            <span className='text-danger mx-2'>Write</span>
                            <span className='text-warning mx-2'>Share</span>
                            <span className='text-success mx-2'>Inspire</span>
                        </h6>
                        <hr style={{ width: '100%', color: 'black' }} />
                    </div>

                    {/* <AddNewPost /> */}
                    {
                        isSuccess && postIds?.map((postId) => <Posts key={postId} postId={postId} />)
                    }
                    {
                        isLoading && <div className='loader'></div>
                    }

                </Col>

                <Col lg={3} className='border d-none d-lg-block' style={{ maxHeight: '100vh' }}>
                    <Suggestions />
                    <img src='https://i.ibb.co/F30b0PT/3532041.jpg' className='img-fluid' />
                    <div className='text-center' style={{ marginTop: '-30px' }}>
                        <a href='https://github.com/Ashlok2003/Socialpedia'>
                            <Button variant='dark' className='fw-bolder rounded-0 fs-4'><i className="fa-brands fa-github"></i> SocialPedia</Button>
                        </a>
                    </div>
                </Col>

            </Row>
        </Container >
    )
}

export default Home

/**
 

 */