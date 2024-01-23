import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Form, OverlayTrigger, Tooltip, ButtonGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Input from '../inputs/Input';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import axios from 'axios';
import { Buffer } from 'buffer';

const Signup = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [reload, setReload] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();


    useEffect(() => {
        const fetchAvatars = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/avatarImages`);
                const avatarsImage = response.data.images.map((x) => `http://localhost:3000/uploads/avatars/${x}`);
                setAvatars(avatarsImage);
                setSelectedAvatar(avatarsImage[0]);
            } catch (error) {
                console.log(error);
            }
            console.log(avatars);
        }

        fetchAvatars();
    }, []);

    const createUser = async (data) => {

        try {
            const response = await axios.post('http://localhost:3000/users/register', data);
            console.log(response.data);
            reset();

        } catch (error) {
            console.log(error);
        }

    }


    return (

        <Container>
            <Row className='d-flex align-items-center justify-content-center mt-2 mb-5'>
                <Col lg={6} className='mt-3'>
                    <Form onSubmit={handleSubmit(createUser)}>

                        <Form.Group className="mb-3 border-bottom " controlId="formTextContent">
                            <h1 className='fs-2 fw-bolder'> Welcome People !</h1>
                            <Form.Text className='fw-bolder text-dark'>Sign up To Continue !</Form.Text>
                        </Form.Group>
                        <Form.Group className='mb-1 d-flex justify-content-center flex-column'>
                            <h5 className='fw-bolder text-center mb-1'>Select Profile Avatar</h5>
                            <ButtonGroup>
                                {avatars.map((x, i) =>
                                    <Button key={i} variant='light' className='mx-1'
                                        onClick={() => setSelectedAvatar(x)}>
                                        <img key={i} src={x} alt='avatarImage'
                                            style={{
                                                height: '80px',
                                                border: selectedAvatar === x ? '2px solid black' : '2px solid transparent',
                                                borderRadius: '50%',
                                                padding: '3px'
                                            }} />
                                    </Button>)}
                            </ButtonGroup>

                        </Form.Group>

                        <Form.Group className="mb-3" controlId="signupName">

                            <Input label="Username" labelClassName="mb-2 fw-bolder fs-5"
                                inputType="text" inputClassName="py-3 form-control border-black" placeholder='Enter Your Full Name'
                                {...register('name', {
                                    required: true,
                                })} />

                            <Form.Text className="text-muted">
                                {errors.name && <p className='text-danger'>Name is required</p>}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className=" mb-3 d-flex align-items-center justify-content-between">

                            <Col lg={6} sm={6} className='me-2'>
                                <Input label="Email" labelClassName="mb-2 fw-bolder fs-5"
                                    inputType="text" inputClassName="py-3 form-control border-black" placeholder='example@email.com'
                                    {...register('email', {
                                        required: true, validate: {
                                            matchPattern: (value) => {
                                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                return emailRegex.test(value) || "Invalid email address";
                                            }
                                        }
                                    })} />

                                {errors.email && <p className='text-danger'>Email is required</p>}
                            </Col>

                            <Col lg={6} sm={6} >
                                <Input label="Password" labelClassName="mb-2 fw-bolder fs-5"
                                    inputType="password" inputClassName="py-3 form-control border-black" placeholder='Password Must Be 8 Digit Long'
                                    {...register('password', {
                                        required: true, validate: {
                                            matchPattern: (value) => {

                                                return value.length > 8 || 'Invalid Password';
                                            }
                                        }
                                    })} />

                                {errors.password && <p className='text-danger'>Password is required</p>}
                            </Col>

                        </Form.Group>

                        <Form.Group className="mb-3" controlId="userBiodata">
                            <Form.Label className="mb-2 fw-bolder fs-5">Write Something About You ?</Form.Label>
                            <textarea type='textarea' className='form-control py-3 border-black'
                                placeholder='Write Something About You'
                                rows={4}
                                {...register("bio", {
                                    required: true
                                })}
                            />

                            {errors.bio && <p className='text-danger'>Bio is required</p>}
                        </Form.Group>

                        <Form.Group className="mb-3 d-flex align-items-center justify-content-between">
                            <Button variant="dark" type="submit" className=' rounded-2 fw-bolder text-white fw-bolder py-2 px-4 fs-5 mt-3'>
                                Get Started
                            </Button>
                            <Button variant='light' className='mt-3 text-decoration-none fw-bolder'
                                onClick={() => navigate('/login')}
                            >Already a User ?</Button>

                        </Form.Group>
                    </Form>
                </Col>

            </Row>
        </Container>

    )
}

export default Signup;
