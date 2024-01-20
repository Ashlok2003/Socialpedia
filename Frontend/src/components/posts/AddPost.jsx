/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from 'react'
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import Input from '../inputs/Input';
import { useDispatch } from 'react-redux';
// import { addNewPost } from '@/store/Posts/postSlice';
import { useAddNewPostMutation } from '@/store/Posts/PostSliceRedux';

const AddPost = ({ value, onClose }) => {

    const [show, setShow] = useState(value);
    const [image, setImage] = useState(null);

    useEffect(() => {
        setShow(value);
    }, [value]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const handleClose = () => {
        setShow(false);
        onClose();
    }
    // const dispatch = useDispatch();

    const [addNewPost, { isLoading }] = useAddNewPostMutation();

    const onSubmit = async (data) => {
        const formdata = new FormData();
        formdata.append('postImage', image);
        formdata.append('title', data.title);
        formdata.append('description', data.description);
        formdata.append('userId', "Ashlok2003");

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
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton> </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className='mb-3 text-center'>
                        <div {...getRootProps()} style={{ border: '2px dashed #aaaaaa', padding: '20px', textAlign: 'center' }} className='text-center'>
                            <input {...getInputProps()} />
                            <img src="https://i.ibb.co/0C3PhGt/5566821-2888068.jpg" alt="upload file" className='img-fluid w-50' style={{ cursor: 'pointer' }} />
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
                        <Input inputType='text' inputClassName='form-control py-5'
                            label='Post Content' labelClassName='fw-bolder fs-5 mb-1' placeholder='Enter Content of your post....'
                            {...register("description", { required: true })}
                        ></Input>

                        {errors.description && <span className='text-danger fw-bolder'>Write Description !</span>}
                    </Form.Group>

                    <Button variant='light' className='fw-bolder w-100' type='submit'> Upload </Button>

                </Form>
            </Modal.Body>
        </Modal >

    )
}

export default AddPost;