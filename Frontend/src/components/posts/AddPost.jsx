/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from 'react'
import { Modal, Button, Form, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import Input from '../inputs/Input';
import { useSelector, useDispatch } from 'react-redux';
// import { addNewPost } from '@/store/Posts/postSlice';
import { useAddNewPostMutation } from '@/store/Posts/PostSliceRedux';
import { selectCurrentUser } from '../../store/Authentication/authSlice';
import { v4 as uuidv4 } from 'uuid';

const AddPost = ({ value, onClose }) => {

    const [show, setShow] = useState(value);
    const [image, setImage] = useState(null);

    useEffect(() => {
        setShow(value);
    }, [value]);

    const userData = useSelector(selectCurrentUser);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const handleClose = () => {
        setShow(false);
        onClose();
    }
    // const dispatch = useDispatch();

    const [addNewPost, { isLoading }] = useAddNewPostMutation();
    const uniqueId = uuidv4();

    const onSubmit = async (data) => {
        const formdata = new FormData();
        formdata.append('postImage', image);
        formdata.append('title', data.title);
        formdata.append('description', data.description);
        formdata.append('userId', userData.name);
        formdata.append('postId', uniqueId);

        try {
            // dispatch(addNewPost(formdata));
            await addNewPost(formdata).unwrap();
        } catch (error) {
            if (error?.originalStatus !== 200)
                console.log(error);
        } finally {
            setImage(null);
            reset();
            handleClose();
        }
    }


    const onDrop = useCallback(async (data) => {
        if (data.length !== 1) {
            alert("Please Upload only one file....");
            return;
        }

        const fileToUpload = data[0];
        setImage(fileToUpload);
        console.log(fileToUpload);

    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1, });


    return (
        <Modal show={show} fullscreen={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <div className='ms-auto'>
                    <span className="text-danger fw-bolder mx-2 fs-4">Write</span>
                    <span className="text-warning fw-bolder mx-2 fs-4">Share</span>
                    <span className="text-success fw-bolder mx-2 fs-4">Inspire</span>
                </div>

            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>


                    <Form.Group className='mb-3 text-center'>
                        <div {...getRootProps()} style={{ border: isDragActive ? '2px dashed #aaaaaa' : '1px solid #aaaaaa', padding: '20px', textAlign: 'center' }} className='text-center'>
                            <input {...getInputProps()} />
                            <img src="https://i.ibb.co/0C3PhGt/5566821-2888068.jpg" alt="upload file" className='img-fluid w-25' style={{ cursor: 'pointer' }} />
                        </div>
                        {image && <span className='text-primary fw-bolder'>{image.path} - Uploaded Successfully !</span>}
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Input inputType='text' inputClassName='form-control py-2'
                            label='Post Title' labelClassName='fw-bolder fs-5 mb-1' placeholder='Enter title of your post....'
                            {...register("title", { required: true })}
                        ></Input>
                        {errors.title && <span className='text-danger fw-bolder'>Title is required !</span>}
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label className='fw-bolder fs-5 mb-1'>Post Content</Form.Label>
                        <textarea type='text' className='form-control'
                            rows={7}
                            placeholder='Enter Content of your post....'
                            {...register("description", { required: true })}
                        ></textarea>

                        {errors.description && <span className='text-danger fw-bolder'>Write Description !</span>}
                    </Form.Group>

                    <Button variant='dark' className='fw-bolder w-100 rounded-0' type='submit'> Upload </Button>


                </Form>
            </Modal.Body>
        </Modal >

    )
}

export default AddPost;