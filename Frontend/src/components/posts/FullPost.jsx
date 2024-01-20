/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, ButtonGroup, Form } from 'react-bootstrap';
import Input from '../inputs/Input';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '@/store/Posts/postSlice';
import { useAddCommentMutation, useAddReactionMutation } from '@/store/Posts/PostSliceRedux';
import { useParams } from 'react-router-dom';
import { selectPostById } from '../../store/Posts/PostSliceRedux';
import { useForm } from 'react-hook-form';

const FullPost = () => {

    const { postId } = useParams();
    const data = useSelector(state => selectPostById(state, postId));

    const userData = useSelector(state => state.user.currentUser);

    const [addComment] = useAddCommentMutation();
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors }, reset } = useForm();


    const [addLikeonPost] = useAddReactionMutation();

    const addLike = async () => {
        try {
            await addLikeonPost({ postId, userId: "Ashlok2003" }).unwrap();
        } catch (error) {
            if (error.originalStatus !== 200)
                console.error('Failed to delete post:', error);
        }
    }

    const onComment = async (comment) => {

        try {
            await addComment({ postId: data._id, userId: "Ashlok2003", username: "Ashlok2003", text: comment.comment });
        } catch (error) {
            console.log(error);
        } finally {
            reset();
        }

    }

    return (
        <Container fluid className='d-flex align-items-center justify-content-between p-4'>
            <Row >
                <Col lg={6}>
                    <Container className='mt-1 border'>
                        <Row>
                            <Col lg={12} className='d-flex align-items-center justify-content-between mt-1 border-bottom'>
                                <Col lg={11} className='d-flex align-items-center py-2'>

                                    <img src={data?.userImage} alt="" style={{ width: '30px' }} />
                                    <span className='fw-bolder ms-3'>{data?.userId} <br /> <span className='text-muted'>Mumbai, Maharashtra</span></span>

                                </Col>
                                <Button variant='light'><i className="fa-solid fa-ellipsis-vertical"></i></Button>
                            </Col>
                            <Col lg={12} className='mt-1 mb-2'>
                                <h5 className='fw-bolder mb-2'>{data?.title}</h5>

                                <p className='text-justify'>{data?.description}</p>


                                <div className="text-center">
                                    <img src={`${data?.imagePath}`}
                                        alt="" className='img-fluid w-75 border' />
                                </div>

                            </Col>
                            <ButtonGroup className='d-flex align-items-center justify-content-between'>
                                <Button variant='light' onClick={addLike}>
                                    <i className="fa-regular fa-thumbs-up">&nbsp; {data?.likes?.length}</i>
                                </Button>
                                <Button variant='light'>
                                    <i className="fa-solid fa-retweet"></i>
                                </Button>
                            </ButtonGroup>
                        </Row>
                    </Container>
                </Col>

                <Col lg={6}>
                    <Container className='mt-3 mb-3 border rounded-4'>
                        <Row>
                            <Col lg={12} className='py-2 border-bottom'>
                                <h6 className='fw-bolder text-decoration-underline link-offset-2'>Comments</h6>
                            </Col>
                            <Col lg={12} style={{ minHeight: "70vh", maxHeight: "70vh" }}>
                                {
                                    data && data?.comments?.map((x, i) =>
                                        <div key={i} className={`d-flex ${x?.user === "Ashlok2003" ? 'justify-content-end ' : 'justify-content-start'}`}>
                                            <div className={`px-3 py-1 rounded-3 mb-1 mt-1 ${x?.user === "Ashlok2003" ? 'bg-dark text-white' : ''}`}>
                                                <h5 className='fw-bolder'>{x?.text}</h5>
                                                <span className='fw-bolder' style={{ fontSize: '10px' }}>{x?.user}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            </Col>
                            <Col lg={12} className='py-2'>
                                <Form onSubmit={handleSubmit(onComment)} className='d-flex align-items-center'>
                                    <Input
                                        inputType='text'
                                        inputClassName='form-control py-2 rounded-0'
                                        placeholder='Write Something...'
                                        {...register("comment", {
                                            required: true
                                        })}
                                    />

                                    <Button variant='light' className='rounded-0 ms-2' type='submit'>
                                        <i className="fa-regular fa-paper-plane fs-4"></i>
                                    </Button>
                                </Form>

                            </Col>

                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}

export default FullPost;