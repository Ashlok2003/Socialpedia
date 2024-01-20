import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import Input from '../inputs/Input';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '@/store/Users/userSlice';

const Signup = ({ functionality }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const createUser = (data) => {
        try {
            dispatch(registerUser(data));
            reset();
            functionality();
        } catch (error) {
            console.log(error);
        }

    }

    return (

        <Form onSubmit={handleSubmit(createUser)}>

            <Form.Group className="mb-3 border-bottom " controlId="formTextContent">
                <h1 className='fs-2 fw-bolder'> Welcome People !</h1>
                <Form.Text className='fw-bolder text-dark'>Sign up To Continue !</Form.Text>
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

            <Form.Group className="mb-3" controlId="signupEmail">

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

                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="signupPassword">
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
            </Form.Group>

            <Form.Group className="mb-3" controlId="userBiodata">
                <Input inputType='textarea' inputClassName='form-control py-3 border-black'
                    label="Write Something About You ?" labelClassName="mb-2 fw-bolder fs-5"
                    placeholder='Write Something About You'
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
                <Button variant='light' className='mt-3 text-decoration-none fw-bolder' onClick={functionality}>Already a User ?</Button>

            </Form.Group>
        </Form>

    )
}

export default Signup;
