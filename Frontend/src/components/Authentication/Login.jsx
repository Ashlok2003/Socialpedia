
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../inputs/Input';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@/store/Authentication/authApiSlice';
import { setCredentials } from '@/store/Authentication/authSlice';
import { store } from '../../store/store';
import { extendedApiSlice } from '../../store/Posts/PostSliceRedux';


const Login = () => {

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
        <Container>
            <Row className='d-flex align-items-center justify-content-center mt-5'>
                <Col lg={5} >
                    <Form onSubmit={handleSubmit(connectUser)} className='vh-100'>
                        <Form.Group className="mb-5 border-bottom" controlId="formTextContent">
                            <h1 className='fs-1 fw-bolder'> Welcome People !</h1>
                            <Form.Text className='fw-bolder text-dark mb-1'>Login To Continue !</Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
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

                            <Form.Text> We'll Not Share Your Email With Anyone</Form.Text>

                            {errors.email && <p className='text-danger'>Email is required</p>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Input label="Password" labelClassName="mb-2 fw-bolder fs-5"
                                inputType="password" inputClassName="py-3 form-control border-black" placeholder='Password Must Be 8 Digit Long'
                                {...register('password', {
                                    required: true, validate: {
                                        matchPattern: (value) => {
                                            return value.length > 8 || 'Invalid Password';
                                        }
                                    }
                                })} />
                                <Form.Text> Please Enter You all Mighty Secure Password</Form.Text>

                            {errors.password && <p className='text-danger'>Password is required</p>}
                        </Form.Group>

                        <Form.Group className="mb-3 text-end">
                            <Button variant="dark" type="submit" className=' rounded-2 fw-bolder text-white fw-bolder py-2 px-5 fs-5 mt-3 w-100'>
                                Join Community
                            </Button>
                            <Button variant='light' src='#' className='mx-2 text-decoration-none text-dark  fw-bolder  mt-3'
                                onClick={() => navigate('/signup')}
                            >New User Registration?</Button>

                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>

    )
}

export default Login;
