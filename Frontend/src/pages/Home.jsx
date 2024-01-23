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
            <Header />
            <Row className='d-flex justify-content-between'>

                <Col lg={3} className='d-none d-lg-block border' style={{ maxHeight: '100vh' }}>
                    <img src='https://i.ibb.co/vBp82k4/4491.jpg' className='img-fluid' />
                </Col>

                <Col lg={6} sm={12} className=''>
                    {/* <Col lg={12} className=''>
                        <Status />
                    </Col> */}

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
                    <div className='text-center' style={{marginTop: '-30px'}}>
                        <Button variant='dark' className='fw-bolder rounded-0 fs-4'><i className="fa-brands fa-github"></i> SocialPedia</Button>
                    </div>
                </Col>

            </Row>
        </Container >
    )
}

export default Home

/**
 

 */