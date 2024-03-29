/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng';
import VideoPlayer from './VideoPlayer';
import { Button } from 'react-bootstrap';
import configuration from '../../config/configuration';

const APP_ID = configuration.APP_ID;
const TOKEN = configuration.TOKEN;
const CHANNEL = configuration.CHANNEL

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

const VideoRoom = ({ socket, setJoined }) => {

    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);

    const handleUserJoined = async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === 'video')
            setUsers((prevUsers) => [...prevUsers, user]);

        if (mediaType === 'audio')
            user.audioTrack.play();
    }

    const handleUserLeft = (user) => {
        setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
    }

    const handleUnload = () => {
        setJoined(false);
        for (let localTrack of localTracks) {
            localTrack.stop();
            localTrack.close();
        }
        client.off('user-published', handleUserJoined);
        client.off('user-left', handleUserLeft);
        client.unpublish().then(() => client.leave());
    };

    useEffect(() => {

        window.addEventListener('beforeunload', handleUnload);

        socket.on('endcall', handleUnload);

        client.on('user-published', handleUserJoined);
        client.on('user-left', handleUserLeft);

        client
            .join(APP_ID, CHANNEL, TOKEN, null)
            .then((uid) =>
                Promise.all([
                    AgoraRTC.createMicrophoneAndCameraTracks(),
                    uid
                ]))
            .then(([tracks, uid]) => {
                const [audioTrack, videoTrack] = tracks;
                setLocalTracks(tracks);

                setUsers((prev) => [...prev, { uid, audioTrack, videoTrack }]);

                client.publish(tracks);
            });

        return () => {

            window.removeEventListener('beforeunload', handleUnload);


            for (let localTrack of localTracks) {
                localTrack.stop();
                localTrack.close();
            }

            client.off('user-published', handleUserJoined);
            client.off('user-left', handleUserLeft);
            client.unpublish().then(() => client.leave());

        }

    }, []);
    return (
        <>
            <div className='d-flex align-items-center flex-column vh-100'>
                {users.map((user) => (
                    <VideoPlayer key={user.uid} user={user} />
                ))}
            </div>

            <Button variant='danger' className='fw-bolder w-100 fs-4'
                onClick={handleUnload}
            ><i className="fa-solid fa-phone-slash"></i> End</Button>

        </>
    )
}

export default VideoRoom