import React from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Status = () => {
    const navigate = useNavigate();

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
       
    };



    return (
        <Slider {...settings}>
                
                <img src="https://i.pinimg.com/236x/f0/46/e3/f046e36020b5d634da2a23d337d10ea9.jpg" alt="" className='rounded-3 img-fluid' />
                <img src="https://i.pinimg.com/236x/f0/46/e3/f046e36020b5d634da2a23d337d10ea9.jpg" alt="" className='rounded-3 img-fluid' />
                <img src="https://i.pinimg.com/236x/f0/46/e3/f046e36020b5d634da2a23d337d10ea9.jpg" alt="" className='rounded-3 img-fluid' />
                <img src="https://i.pinimg.com/236x/f0/46/e3/f046e36020b5d634da2a23d337d10ea9.jpg" alt="" className='rounded-3 img-fluid' />
                <img src="https://i.pinimg.com/236x/f0/46/e3/f046e36020b5d634da2a23d337d10ea9.jpg" alt="" className='rounded-3 img-fluid' />
                <img src="https://i.pinimg.com/236x/f0/46/e3/f046e36020b5d634da2a23d337d10ea9.jpg" alt="" className='rounded-3 img-fluid' />
                
        </Slider>
    );
};

Status.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool,
    type: PropTypes.bool,
};

export default Status;
