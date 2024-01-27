/* eslint-disable no-useless-catch */
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { useMediaQuery } from 'react-responsive';
import { Button, Carousel, Form, FormGroup, Modal, ModalBody, ModalHeader } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/Authentication/authSlice';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import useAxiosFunction from '../../hooks/useAxiosFunction';
import Input from '../inputs/Input';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import configuration from '../../config/configuration';

const Status = () => {

    const BASE_URL = configuration.SERVER_URL;

    const [selected, setSelected] = useState(null);
    const [image, setImage] = useState(null);
    const [allStatus, setAllStatus] = useState(null);
    const [currentStatus, setCurrentStatus] = useState([]);
    const [showStatus, setShowStatus] = useState(false);
    const [addingStatusModal, setAddingStatusModal] = useState(false);
    const [text, setText] = useState("");
    const [response, error, loading, axiosFetch] = useAxiosFunction();


    const currentUser = useSelector(selectCurrentUser);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const settings = {
        infinite: false,
        slidesToShow: isMobile ? 5 : 8,
        slidesToScroll: 1,
        arrows: true,
    };


    const handleShow = (index) => {
        setSelected(index);
        setCurrentStatus(allStatus[index].images);
        setShowStatus(true);
    };

    const handleClose = () => setShowStatus(false);

    console.log(currentStatus);


    const StatusCarousel = () => (

        <Carousel className="custom-carousel">
            {currentStatus && currentStatus?.map((button, index) => (
                <Carousel.Item key={index}>
                    <img src={`${BASE_URL}/${button.imageUrl}`} className='' style={{ height: '100%', width: '100%' }} alt={`Status ${index + 1}`} />
                    <Carousel.Caption>
                        <h3 className='bg-dark rounded-5 py-2 text-white'>{button.text} </h3>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );


    const uploadStatus = async () => {
        try {
            const formData = new FormData();
            formData.append('text', text);
            formData.append('statusImage', image);
            formData.append('userId', currentUser?._id);
            formData.append('avatarImage', currentUser?.avatarImage);
            formData.append('name', currentUser?.name);
            formData.append('email', currentUser?.email);

            await axios.post(`${BASE_URL}/users/addstatus`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setAddingStatusModal(false);
        } catch (error) {
            throw error;
        }
    };


    const handleSubmit = async () => {
        try {
            if (!text || !image) {
                alert("Please enter text and select an image!");
                return;
            }

            await uploadStatus();

            setText('');
            setImage(null);
            getStatus();

        } catch (error) {
            console.error(error);
            alert("Error adding status. Please try again.");
        }
    };

    const getStatus = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/users/getallstatus`);
            const data = response.data.reverse();
            setAllStatus(data);

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getStatus();
    }, []);


    const onDrop = React.useCallback(async (data) => {
        if (data.length !== 1) {
            alert("Please Upload only one file");
            return;
        }

        const fileToUpload = data[0];
        setImage(fileToUpload);
    }, []);


    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

    return (
        <div className='slick-carousel-container'>
            {allStatus && (
                <Modal size='lg' show={showStatus} onHide={handleClose} centered>
                    <Modal.Header closeButton className=''>
                        <Modal.Title className='d-flex align-items-center'>
                            <img src={allStatus[selected]?.avatarImage} alt="" style={{ height: '60px' }} />
                            <div className='d-flex flex-column ms-2'>
                                <h6 className='fw-bolder'>{allStatus[selected]?.name}</h6>
                                <h6 className='fw-bolder'>{allStatus[selected]?.email}</h6>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <ModalBody className='d-flex align-items-center justify-content-center'>
                        {StatusCarousel()}
                    </ModalBody>
                </Modal>
            )}

            <Modal size='lg' show={addingStatusModal} onHide={() => setAddingStatusModal(prev => !prev)}>
                <Modal.Header closeButton className='' />
                <Modal.Body className='d-flex align-items-center justify-content-center'>
                    <Form>
                        <Form.Group className="mb-3" controlId="image">
                            <div {...getRootProps()} style={{ border: isDragActive ? '2px dashed #aaaaaa' : '1px solid #aaaaaa', padding: '20px', textAlign: 'center' }} className='text-center'>
                                <input {...getInputProps()} />
                                <img src="https://i.ibb.co/0C3PhGt/5566821-2888068.jpg" alt="upload file" className='img-fluid w-25' style={{ cursor: 'pointer' }} />
                            </div>
                            {image && <span className='text-primary fw-bolder'>{image.path} - Uploaded Successfully !</span>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="text">
                            <Input inputClassName='form-control py-2' inputType='text' placeholder='Enter your status'
                                label="Status Title" labelClassName="mb-2 fw-bolder" value={text} onChange={(event) => setText(event.target.value)} />
                        </Form.Group>
                        <Button variant="dark" className='w-100 rounded-0' onClick={handleSubmit}>Upload Status</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Slider {...settings}>
                <img src="https://i.ibb.co/MfPsqzk/noun-plus-round-338400.png" alt="" className='img-fluid rounded-circle mt-2'
                    onClick={() => setAddingStatusModal(prev => !prev)}
                />
                {allStatus && allStatus?.map((button, index) => (
                    <img
                        src={`${button.avatarImage}`}
                        key={index}
                        alt={`Button ${index + 1}`}
                        className='p-2 rounded-circle img-fluid'
                        onClick={() => handleShow(index)}
                        style={{ border: '2px solid black', padding: '20px' }}
                    />
                ))}
            </Slider>
        </div>
    );
};

export default Status;
