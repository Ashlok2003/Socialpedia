import { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Camera from '../../assets/camera.png';
import Mic from '../../assets/mic.png';
import Phone from '../../assets/phone.png';
import { useParams } from 'react-router-dom';
import './videoStyle.css';


const VideoCalling = () => {

    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const socket = useSocket();
    
    return (
        <div>
            <div id='videos'>
                <video src="" className='video-player' id='user-1' autoPlay playsInline></video>
                <video src="" className='video-player' id='user-2' autoPlay playsInline></video>
            </div>
            <div id='controls'>

                <div className="control-container" id="camera-btn">
                    <img src={Camera} alt="camera" />
                </div>

                <div className="control-container" id="mic-btn">
                    <img src={Mic} alt="mic" />
                </div>

                <div className="control-container" id="leave-btn">
                    <img src={Phone} alt="call end" />
                </div>

            </div>
        </div>
    )
}

export default VideoCalling