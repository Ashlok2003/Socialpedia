import React from 'react'
import { Container, Row, Col, ListGroup, Accordion, Card, Button } from 'react-bootstrap'
import Posts from '../components/posts/Posts'
import AddNewPost from '../components/posts/AddNewPost'
import OnlineFriends from '../components/home/OnlineFriends'
import Suggestions from '../components/home/Suggestions';
import { useSelector } from 'react-redux';
import Header from '../components/header/Header';
import { useGetPostsQuery, selectPostIds } from '@/store/Posts/PostSliceRedux'

function Home() {


    /* 
        const posts = useSelector(state => state.posts.posts);
        console.log(posts);
     */

    const { isLoading, isSuccess } = useGetPostsQuery();
    const postIds = useSelector(selectPostIds);

    


    return (
        <Container fluid>
            <Header />
            <Row className='d-flex justify-content-between'>

                <Col lg={3} className='d-none d-lg-block shadow' style={{ maxHeight: '100vh' }}>
                    <img src='https://i.ibb.co/74z335P/4022487.jpg' className='img-fluid' />
                </Col>

                <Col lg={6} sm={12} className=''>

                    <AddNewPost />
                    {
                        isSuccess && postIds?.map((postId) => <Posts key={postId} postId={postId} />)
                    }
                    {
                        isLoading && <div>Loading....</div>
                    }

                </Col>

                <Col lg={3} className='border shadow d-none d-lg-block' style={{ maxHeight: '100vh' }}>

                    <img src='https://i.ibb.co/B6n3MMd/Ashlokkkk.png' className='img-fluid' />
                </Col>

            </Row>
        </Container >
    )
}

export default Home

/**
 

 */