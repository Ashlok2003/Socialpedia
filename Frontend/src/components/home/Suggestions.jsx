import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from '../../api/suggestionsApi';
import useAxiosFunction from '../../hooks/useAxiosFunction';
import { useNavigate } from 'react-router-dom';
const Suggestions = () => {

    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);

    const [response, error, loading, axiosFetch] = useAxiosFunction();

    const getSuggestions = async () => {
        await axiosFetch({
            axiosInstance: axios,
            method: 'get',
            url: '/suggestions'
        })
    }

    useEffect(() => {
        getSuggestions();
    }, [refresh]);

    console.log(response);

    return (
        <Container className='p-3 rounded-3'>
            <Row>

                <Col lg={12} className='mb-3 d-flex justify-content-between'>
                    <h5 className='text-decoration-underline link-offset-3 fw-bolder'>🥳 Suggestions...✌️</h5>
                    <Button variant='light'><i className="fa-solid fa-arrows-rotate"
                        onClick={() => setRefresh(prev => !prev)}
                    ></i></Button>
                </Col>
                {
                    loading && <div className="loader"></div>
                }

                {
                    response && response.map((x, i) => (
                        <Col key={i} lg={12} className='d-flex align-items-center justify-content-between px-3 py-2'
                            style={{ cursor: 'pointer' }}
                        >
                            <div>
                                <img src={x.avatarImage} alt={x.name} style={{ height: '30px' }} />
                                <span className='fw-bolder ms-3'>{x.name}</span>
                            </div>
                            <Button variant='dark' className='rounded-0 me-2'
                                onClick={() => navigate(`/Profile/${x.name}/${x._id}`)}
                            >Profile</Button>
                        </Col>
                    ))
                }


            </Row>
        </Container>
    )
}

export default Suggestions;

