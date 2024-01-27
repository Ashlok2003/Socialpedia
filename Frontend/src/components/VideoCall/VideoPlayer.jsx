/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react'

const VideoPlayer = ({ user }) => {

    const ref = useRef();
    console.log(user);

    useEffect(() => {
        user.videoTrack.play(ref.current);
    }, []);


    return (
        <>
            <div ref={ref} className='mt-2' style={{ width: '100%', height: '90%' }}>
            </div>
        </>
    )
}

export default VideoPlayer