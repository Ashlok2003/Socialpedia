import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {

  const navigate = useNavigate();

  return (
    <Container>
      <Row className='d-flex align-items-center justify-content-center'>

        <Col lg={6}>
          <img src="https://i.ibb.co/10HzMLd/Welcome-Enchanced.png" alt="Welcome-Enchanced" border="0" className='img-fluid' />
        </Col>

        <Col lg={6} className='px-3'>

          <h2 className='fw-bolder display-4'>Start your Journey of discovery and entertainment with Socialpedia.  </h2>
          <h2 className='fw-bolder mt-3'>" Let&apos;s explore the extraordinary together! "</h2>
          <p className='lead mt-4 text-justify' style={{ fontWeight: '400', fontStyle: 'italic' }}><span className='fw-bolder'>Welcome to Socialpedia</span>, <br/> Your go-to destination for insightful articles, engaging stories, and connecting people! Dive into a world of inspiration where we explore topics ranging from technology trends, lifestyle hacks, and thought-provoking pieces on the latest advancements.</p>

          <div className='text-end'>
            <Button variant='dark btn-lg' className='px-5 fw-bolder rounded-0' onClick={() => navigate('/Login')}>Register Now</Button>
          </div>

        </Col>

        <Col lg={12} className='mt-5 border-top border-bottom py-2'>
          <p className='text-start' style={{fontSize: '10px'}}>
            Fusce eu massa sit amet leo sollicitudin feugiat et et mauris. Aenean vitae pharetra enim. Nunc tincidunt, velit vitae pharetra ultrices, felis odio sodales justo, sit amet congue nulla turpis ac justo. <br />
            Our team of passionate writers and experts curate content that aims to inform, entertain, and enlighten. Whether you're seeking advice on productivity, looking for DIY guides, or craving the latest updates in the world of science and innovation, we've got you covered.
          </p>
        </Col>


      </Row>
    </Container>
  )
};


