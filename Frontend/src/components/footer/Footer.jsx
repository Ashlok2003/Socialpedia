import React from 'react';
import { Container, Row, Col, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faBell, faGrip, faHouseChimney, faEarthAmericas, faSun, faEnvelopeOpen, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import AddPost from '../posts/AddPost';

const Footer = () => {

  const [open, setOpen] = React.useState(false);

  const handleModalOpen = () => {
    setOpen(true);
  }

  const handleModalClose = () => {
    setOpen(false);
  }
  const renderer = (x) => {
    return <Tooltip>{x}</Tooltip>;
  };

  return (
    <footer className="footer mt-auto py-2 sticky-bottom container-fluid">
      <Container fluid>
        <Row className='align-items-center justify-content-center px-lg-3'>

          <Col lg={6} xl={5} className='d-flex mt-auto align-items-center bg-light justify-content-between border shadow rounded-4 px-4 py-2'>
            <OverlayTrigger placement='bottom' overlay={renderer('Home')}>
              <NavLink to='Home'> <FontAwesomeIcon icon={faHouseChimney} className="fs-5 text-dark" /></NavLink>
            </OverlayTrigger>

            <OverlayTrigger placement='bottom' overlay={renderer('Explore')}>
              <NavLink to='Explore'><FontAwesomeIcon icon={faEarthAmericas} className="fs-5 text-dark" /></NavLink>
            </OverlayTrigger>

            <OverlayTrigger placement='bottom' overlay={renderer('Reels')}>
              <Button variant='light' onClick={handleModalOpen}><FontAwesomeIcon icon={faCirclePlus} className="fs-1 text-dark rounded-circle" /></Button>
            </OverlayTrigger>

            <OverlayTrigger placement='bottom' overlay={renderer('Messages')}>
              <NavLink to='Messages'><FontAwesomeIcon icon={faEnvelopeOpen} className="fs-5 text-dark" /></NavLink>
            </OverlayTrigger>

            <OverlayTrigger placement='bottom' overlay={renderer('Profile')}>
              <NavLink to='UserProfile'><FontAwesomeIcon icon={faUserShield} className="fs-5 text-dark" /></NavLink>
            </OverlayTrigger>
          </Col>
        </Row>
      </Container>
      <AddPost value={open} onClose={handleModalClose} />
    </footer>
  );
};

export default Footer;
