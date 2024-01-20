import React, { } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Suggestions = () => {

    /* 
   todo: Add a button which will help us to navigate to the specific user profile....
   todo: Fetch atmost 3-4 users from database which can be suggested randomly.....
   */

    return (
        <Container className='shadow p-3 rounded-3'>
            <Row>

                <Col lg={12} >
                    <h6 className='text-decoration-underline link-offset-2 fw-bolder'>Suggestions...</h6>
                </Col>
                <Col lg={12} className='d-flex align-items-center px-3 py-2 mb-2 border'>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/330px-User_icon_2.svg.png" alt="" style={{ width: '30px' }} />
                    <span className='fw-bolder ms-3'>Ashlok Chaudhary</span>
                </Col>

                <Col lg={12} className='d-flex align-items-center px-3 py-2 mb-2 border'>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/330px-User_icon_2.svg.png" alt="" style={{ width: '30px' }} />
                    <span className='fw-bolder ms-3'>Ashlok Chaudhary</span>
                </Col>

                <Col lg={12} className='d-flex align-items-center px-3 py-2 mb-2 border'>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/330px-User_icon_2.svg.png" alt="" style={{ width: '30px' }} />
                    <span className='fw-bolder ms-3'>Ashlok Chaudhary</span>
                </Col>

            </Row>
        </Container>
    )
}

export default Suggestions;

