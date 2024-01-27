/* eslint-disable react/prop-types */
import React from 'react'
import { useNavigate } from 'react-router-dom';

const VideoNotification = ({ userId, username, userImage, toast, videoCall }) => {

    const navigate = useNavigate();

    

    const handleAccept = () => {
        console.log("Accepted !");
        videoCall(true);
    }

    return (
        <div className='d-flex flex-column'>
            <h6 className='fw-bolder'>Incoming Call.....</h6>
            <div className='d-flex align-items-center '>
                <img src={userImage} alt="" className='mx-2' style={{ height: '50px' }} />
                <h6>{username} </h6>
            </div>
            <button className='btn btn-success fw-bolder p-2' onClick={handleAccept}>Answer Call</button>
        </div>
    );
}

export default VideoNotification