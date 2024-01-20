import React from 'react'
import UserProfile from '../components/User/UserProfile'
import { Container, Row, Col } from 'react-bootstrap';
/* Add Much Detailed User Details.... in more appealing way... */
function Profile() {
  return (
    <Container>
      <Row className='d-flex align-items-center justify-content-center'>
        <Col lg={6}>
          <UserProfile />
        </Col>
      </Row>
    </Container>
  )
}

export default Profile