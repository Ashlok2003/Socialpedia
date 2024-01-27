/* eslint-disable react/prop-types */
import { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import fetchUserStartWith from '../../api/fetchUserStartWith';

const ListUser = ({ searchTerm }) => {

    const navigate = useNavigate();
    const fetchUser = useCallback((name) => fetchUserStartWith(name), []);

    const { isLoading, error, data } = useSWR(searchTerm ? searchTerm : null, fetchUser);

    console.log(error);

    return (
        <>
            {isLoading && <h1 className="loader text-center"></h1>}
            {!isLoading && error && error.request.status === 404 && <h3 className='fw-bolder'>No Such User Exists !</h3>}
            {!isLoading && error && error.request.status !== 404 && <p>{error.message}</p>}
            {!isLoading && !error && data && data.map((x, i) => (

                <div key={i} className='d-flex align-items-center justify-content-between p-2 border mt-2'
                    onClick={() => navigate(`/Profile/${x.name}/${x._id}`)}
                >
                    <div className='d-flex align-items-center'>
                        <img src={x.avatarImage} alt="" style={{ height: '50px' }} />
                        <div className='ms-2'>
                            <h6 className='fw-bolder'>{x.name}</h6>
                            <h6 className='fw-bolder'>{x.email}</h6>
                        </div>
                    </div>


                </div>
            ))}
            {!isLoading && !error && !data && searchTerm && <p>No Such User Exists</p>}
            {!isLoading && !error && !data && !searchTerm && <h1 className='fw-bolder text-center display-1'>Please Search...</h1>}

        </>
    )
}

export default ListUser;