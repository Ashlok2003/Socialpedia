/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Container, Row, Col, ButtonGroup, Button, DropdownButton, Dropdown } from 'react-bootstrap'

import { useSelector } from 'react-redux';
import { selectPostById, useDeletePostMutation, useAddReactionMutation } from '@/store/Posts/PostSliceRedux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../../store/Authentication/authSlice';


function Posts({ postId }) {

    const navigate = useNavigate();

    const data = useSelector(state => selectPostById(state, postId));

    const userData = useSelector(selectCurrentUser);


    const [deletePost] = useDeletePostMutation();
    const [addLikeonPost] = useAddReactionMutation();

    const addLike = async () => {
        try {
            await addLikeonPost({ postId, userId: userData._id }).unwrap();
            console.log(postId, userData._id);
        } catch (error) {
            if (error.originalStatus !== 200)
                console.error('Failed to delete post:', error);
        }
    }

    const onDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                // await dispatch(deletePost({ id: post.id })).unwrap();
                await deletePost({ id: data.postId }).unwrap();
            } catch (error) {
                if (error.originalStatus !== 200)
                    console.error('Failed to delete post:', error);
            }
        }
    }

    return (
        <Container className='mt-3 border'>
            <Row>
                <Col lg={12} className='d-flex align-items-center justify-content-between mt-1 border-bottom'>
                    <Col lg={11} className='d-flex align-items-center py-2'

                    >

                        <img src={data?.userImage} alt="" style={{ width: '30px' }} />
                        <span className='fw-bolder ms-3'>{data?.userId} <br /> <span className='text-muted'>Mumbai, Maharashtra</span></span>

                    </Col>

                    {userData.name === data?.userId && <DropdownButton
                        direction='start'
                        variant='light'
                        title={<i className="fa-solid fa-ellipsis-vertical"></i>}
                    >
                        <Dropdown.Item className='text-dark'><i className="fa-solid fa-pen-to-square"></i> Edit Post</Dropdown.Item>
                        <Dropdown.Item className='text-danger'
                            onClick={onDelete}
                        ><i className="fa-solid fa-trash"></i> Delete Post</Dropdown.Item>
                    </DropdownButton>}


                </Col>
                <Col lg={12} className='mt-2 mb-2'>
                    <h6 className='fw-bolder mb-2'>{data?.title}</h6>
                    <p className='truncate-3-lines' onClick={() => navigate(`/Fullpost/${postId}`)} style={{ cursor: 'pointer' }}>{data?.description}</p>

                    <div className='text-center'>
                        <img src={`${data?.imagePath}`}
                            alt="" className='img-fluid border' />
                    </div>
                </Col>

                <ButtonGroup className='d-flex align-items-center justify-content-between'>
                    <Button variant='light' onClick={addLike}>
                        <i className={`${data?.likes.includes(userData._id) ? 'fa-solid fa-thumbs-up' : 'fa-regular fa-thumbs-up'}`}> &nbsp; {data?.likes?.length}</i>
                    </Button>
                    <Button variant='light' onClick={() => navigate(`/Fullpost/${data?.postId}`)}>
                        <i className="fa-solid fa-comments"></i>
                    </Button>
                    <Button variant='light'>
                        <i className="fa-solid fa-retweet"></i>
                    </Button>
                </ButtonGroup>
            </Row>

        </Container>
    )
}

export default Posts