import React, { useState, useRef, useEffect } from 'react'
import { Container, Row, Col, Button, ButtonGroup, Modal, ModalBody, ModalHeader } from 'react-bootstrap';
import Input from '../inputs/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faImages } from '@fortawesome/free-solid-svg-icons';
import AddPost from './AddPost';
import { useSelector } from 'react-redux';

const AddNewPost = () => {

  const userDataFromStore = useSelector(state => state.user.currentUser);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setUserData(userDataFromStore);
  }, [userData]);

  const [open, setOpen] = useState(false);

  const handleModalOpen = () => {
    setOpen(true);
  }

  const handleModalClose = () => {
    setOpen(false);
  }

  return (
    <Container>
      <Row>
        <Col lg={12} className='border shadow p-4 mt-3 rounded-4'>
          <div className='d-flex align-items-center justify-content-between'>

            <img src={userData?.avatarImage} alt="" style={{ width: '30px' }} />

            <Input inputType='text' inputClassName='border-black form-control py-2 ms-2' placeholder='Write Something...' />

            <Button variant='light' className='rounded-0 ms-2'><FontAwesomeIcon icon={faPaperPlane} className="fs-3" /></Button>
          </div>

          <ButtonGroup className='d-flex align-items-center justify-content-center mt-3'>
            <Button variant='light' className='fw-bolder' onClick={handleModalOpen} >
              <FontAwesomeIcon icon={faImages} className="fs-4" /> &nbsp;Write Full Post....</Button>
          </ButtonGroup>

        </Col>
      </Row>
      <Row>
        <AddPost value={open} onClose={handleModalClose} />
      </Row>
    </Container>
  )
}

export default AddNewPost