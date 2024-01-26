/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react'
import { useSocket } from '../../context/SocketProvider';
import peer from '../../services/peerServices';
import ReactPlayer from 'react-player';
import { Container, Row, Col, Button } from 'react-bootstrap';

const VideoCalling = () => {

    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();

    const socket = useSocket();

    const handleUserJoin = useCallback(({ email, id }) => {
        setRemoteSocketId(id);
    }, []);


    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true, video: true
        });

        const offer = await peer.getOffer();
        socket.emit('user:call', { to: remoteSocketId, offer });

        setMyStream(stream);
    }, [setRemoteSocketId, socket]);

    const handleIncomingCall = useCallback(async ({ from, offer }) => {

        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true, audio: true
        });

        const ans = await peer.getAnswer(offer);
        socket.emit('call:accepted', { to: from, ans });

        setMyStream(stream);
    }, [socket]);


    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }
    }, [myStream]);

    const handleCallAccepted = useCallback(({ from, ans }) => {
        peer.setLocalDescription(ans);
        sendStreams();
    }, [sendStreams]);

    const handleNegotiationNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit('peer:nego:needed', { offer, to: remoteSocketId });
    }, []);

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegotiationNeeded);

        return () => {
            peer.peer.removeEventListener('negotiationneeded', handleNegotiationNeeded);
        }
    }, [handleNegotiationNeeded]);

    const handleNegotiationIncoming = useCallback(async ({ from, offer }) => {
        const ans = await peer.getAnswer(offer);
        socket.emit('peer:nego:done', { to: from, ans });
    }, [socket]);

    const handleNegotiationFinal = useCallback(async ({ from, ans }) => {
        await peer.setLocalDescription(ans);
    }, [socket]);

    useEffect(() => {
        peer.peer.addEventListener('track', async (event) => {
            const remoteStream = event.streams;
            console.log('Got Tracks');
            setRemoteStream(remoteStream[0]);
        });
    }, [])


    useEffect(() => {
        socket.on('user:joined', handleUserJoin);
        socket.on('incoming:call', handleIncomingCall);
        socket.on('call:accepted', handleCallAccepted);
        socket.on('peer:nego:needed', handleNegotiationIncoming);
        socket.on('peer:nego:final', handleNegotiationFinal);

        return () => {
            socket.off('user:joined', handleUserJoin);
            socket.off('incoming:call', handleIncomingCall);
            socket.off('call:accepted', handleCallAccepted);
            socket.off('peer:nego:needed', handleNegotiationIncoming);
            socket.off('peer:nego:final', handleNegotiationFinal);
        }

    }, [socket, handleUserJoin, handleCallAccepted, handleIncomingCall,
        handleNegotiationIncoming, handleNegotiationFinal
    ]);

    return (
        <Container>
            <Row>
                <Col lg={12} className='text-center'>
                    <h1 className="fw-bolder">Room </h1>
                    <h4 className='fw-bolder mt-3'>{remoteSocketId ? 'Connected' : 'No One in'}</h4>
                    {myStream && <Button variant='dark'>Send Streams</Button>}
                    {
                        remoteSocketId && <Button variant='success' className='fw-bolder' onClick={handleCallUser}>
                            <i className="fa-solid fa-phone"> Call</i>
                        </Button>
                    }

                    {
                        myStream && <>
                            <h5 className='fw-bolder'>My Stream</h5>
                            <ReactPlayer playing url={myStream} height="600px" width="300px" />
                        </>
                    }
                    {
                        remoteStream && <>
                            <h5 className='fw-bolder'>Remote Stream</h5>
                            <ReactPlayer playing url={remoteStream} height="600px" width="300px" />
                        </>
                    }

                </Col>
            </Row>
        </Container>
    )
}

export default VideoCalling