import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../inputs/Input';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/store/Users/userSlice';
import { getPosts } from '@/store/Posts/postSlice';
import { useLoginMutation } from '@/store/Authentication/authApiSlice';
import { setCredentials } from '@/store/Authentication/authSlice';
import { store } from '../../store/store';
import { extendedApiSlice } from '../../store/Posts/PostSliceRedux';
const Login = ({ functionality }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [login, { isLoading, isSuccess }] = useLoginMutation();
    const connectUser = async (data) => {
        try {

            const response = await login(data).unwrap();
            
            dispatch(setCredentials({ userData: response.userData._doc, accessToken: response.userData.accessToken }));
            store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());

            reset();
            navigate('/home');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form onSubmit={handleSubmit(connectUser)} className='vh-100'>
            <Form.Group className="mb-5 border-bottom" controlId="formTextContent">
                <h1 className='fs-1 fw-bolder'> Welcome People !</h1>
                <Form.Text className='fw-bolder text-dark mb-1'>Login To Continue !</Form.Text>
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

                {errors.email && <p className='fw-bolder text-danger'>Email Required</p>}
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
                {errors.password && <p className='fw-bolder text-danger'>Check the Password</p>}
            </Form.Group>

            <Form.Group className="mb-3 text-end">
                <Button variant="dark" type="submit" className=' rounded-2 fw-bolder text-white fw-bolder py-2 px-5 fs-5 mt-3 w-100'>
                    Join Community
                </Button>
                <Button variant='light' src='#' className='mx-2 text-decoration-none text-dark  fw-bolder  mt-3' onClick={functionality}>New User Registration?</Button>

            </Form.Group>
        </Form>

    )
}

export default Login;
