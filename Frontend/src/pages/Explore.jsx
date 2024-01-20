import { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function Explore() {

    const [searchText, setSearchText] = useState(null);
    const [searchData, setSearchData] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await axios('http://localhost:3000/fetchallusers');
            console.log(response.data);
            setSearchData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container className='mt-4' style={{ height: '85vh' }}>
            <Row className='d-flex justify-content-center'>
                <Col lg={8}>
                    <div className='d-flex align-items-center'>
                        <input type='text' className='form-control py-2 rounded-0' placeholder='Search' value={searchText}
                            onChange={(event) => setSearchText(event.target.value)}
                        />
                        <Button variant='light' className='fs-5 rounded-0'><FontAwesomeIcon icon={faSearch}
                            onClick={fetchUsers}
                        /></Button>
                    </div>
                    {
                        !searchData &&
                        <div className='mt-4 display-1 text-center fw-bolder'>Please Search </div>
                    }
                </Col>
                <Col lg={12}>
                    {
                        searchData && searchData?.map((x, i) =>
                            <div key={i} className='fw-bolder'>
                                {x.name}
                            </div>
                        )
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default Explore