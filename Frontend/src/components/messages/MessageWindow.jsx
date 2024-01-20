import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Button, Overlay, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import { useMediaQuery } from 'react-responsive';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

import { useNavigate } from 'react-router-dom';

import Input from '../inputs/Input';

const MessageWindow = () => {

    const navigate = useNavigate();

    const [showEmoji, setShowEmoji] = useState(false);
    const [selected, setSelected] = useState(false);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const [mobileComponent, setMobileComponent] = useState(false);

    const toggleMobile = () => {
        setSelected(!selected);
        setMobileComponent(!mobileComponent);
    };

    const target = useRef(null);

    const [socket, setSocket] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const currentUser = useSelector(state => state.user.currentUser);
    const [receiverId, setReceiverId] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userList, setUserList] = useState([]);
    const [conversationId, setConversationId] = useState(null);

    const scrollRef = useRef();

    useEffect(() => {
        if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');

        newSocket.on('connect', () => {
            console.log('Connected To Server');

            newSocket.emit('addUser', { userID: currentUser._id });
            setSocket(newSocket);
        });

        newSocket.on('userList', (users) => {
            setUserList(users);
            console.log(users);
        });

        newSocket.on('receiverMessage', ({ conversationId, senderId, text }) => {
            setMessages((prevMessages) => [...prevMessages, { conversationId, senderId, message: text }]);
        });

        newSocket.on('userActivity', ({ userId, activity }) => {
            console.log(`${userId} is ${activity}`);
        });

        newSocket.on('messages', ({ conversationId, messages }) => {
            setConversationId(conversationId);
            console.log("Messages", messages);
            setMessages(messages);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            newSocket.disconnect();
        };
    }, [currentUser]);

    const getMessages = () => {
        socket?.emit('getMessages', { senderId: currentUser?._id, receiverId: selectedUser?._id });
    };

    const openEmojiPicker = () => {
        setShowEmoji(!showEmoji);
    };

    const handleSendMessage = () => {
        if (message && receiverId && socket) {
            const newMessage = { senderId: currentUser?._id, receiverId, text: message };

            socket.emit('sendMessage', newMessage);
            setMessages((prevMessages) => [...prevMessages, { conversationId, senderId: currentUser?._id, message }]);
            setMessage('');
        }
    };

    return (
        <Container fluid className='mt-lg-4 mt-auto px-lg-5'>
            <Row className='d-flex justify-content-between border-bottom'>
                <Col className='border rounded-3' lg={3} style={{ display: isMobile && selected && mobileComponent ? 'none' : 'block' }}>
                    <div className='py-2 border-bottom text-center'>
                        <h4 className='fw-bolder link-offset-2 mb-3'>Chats</h4>
                        <div className='d-flex align-items-center justify-content-center'>
                            <input className='form-control py-2 rounded-0' placeholder='Search Users...' />
                            <Button variant='light' className='fw-bolder fs-5 rounded-0'><i className="fa-solid fa-magnifying-glass"></i></Button>
                        </div>
                    </div>
                    <div className='overflow-hidden' style={{ height: '70vh' }}>
                        <div className='overflow-auto' style={{ maxHeight: '100%' }}>
                            {userList && userList?.map((x) => (
                                <div key={x.socketId} className='d-flex mt-2 border-bottom py-2' style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setSelected(!selected);
                                        setSelectedUser(x.userData);
                                        setReceiverId(x.userData._id);
                                        getMessages();
                                        setMobileComponent(!mobileComponent);
                                    }}
                                >
                                    <img src={x.userData.avatarImage} style={{ width: '60px' }} alt={`Avatar of ${x.userData.name}`} />
                                    <div className='ms-2'>
                                        <h6 className='fw-bolder'>{x.userData.name}</h6>
                                        <h6 className='fw-bolder '>{x.userData.email}</h6>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
                {selected ? (
                    <Col className='border rounded-3' lg={9}>
                        <div className="d-flex align-items-center justify-content-between  border-bottom py-2">
                            <div className='col-lg-4 d-flex align-items-center flex-row'>
                                {isMobile && <Button variant='light' onClick={toggleMobile}><FontAwesomeIcon icon={faArrowCircleLeft} /></Button>}
                                <Button variant='light'>< img src={selectedUser?.avatarImage} style={{ width: '30px' }} /></Button>
                                <h6 className='fw-bolder link-offset-2 mt-2 ms-3'>{selectedUser?.name}</h6>
                            </div>
                            <Button variant='light' onClick={() => navigate('/videocall/1233')}><i className="fa-solid fa-video fs-5"></i></Button>
                        </div>
                        <div className='overflow-hidden' style={{ height: '70vh' }}>
                            <div className='overflow-auto' ref={scrollRef} style={{ maxHeight: '100%' }}>
                                {messages && messages.map((x, i) => (
                                    <div key={i} className={`d-flex ${x.senderId === currentUser?._id ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <h6 className={`${x.senderId === currentUser?._id ? 'bg-dark text-white rounded-4' : ''} p-3`}>{x.message}</h6>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Col lg={12} className='d-flex align-items-center py-2 border-top'>
                            <Button variant='light' ref={target} onClick={openEmojiPicker} className='fs-3 me-2'>
                                <i className="fa-regular fa-face-smile"></i>
                            </Button>
                            <Overlay target={target.current} show={showEmoji} placement="top">
                                {(props) => (
                                    <Tooltip id="tooltip" {...props}>
                                        <Picker data={data} previewPosition="none" onEmojiSelect={(event) => setMessage(message + event.native)} />
                                    </Tooltip>
                                )}
                            </Overlay>
                            <Input
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                inputType='text'
                                inputClassName='form-control py-2 rounded-5'
                                placeholder='Write Something...'
                            />
                            <Button variant='light' className='rounded-0 ms-2' onClick={handleSendMessage}>
                                <i className="fa-regular fa-paper-plane fs-4"></i>
                            </Button>
                        </Col>
                    </Col>
                ) : (
                    <Col className='border rounded-3 text-center' lg={9}>
                        <img src='https://i.ibb.co/pPXrFy5/2782781.jpg' alt='Placeholder' className={isMobile ? 'w-100 img-fluid' : 'w-50 img-fluid'} />
                        <h6 className='fw-bolder mt-5'>Please Select User to Start Conversation!</h6>
                    </Col>
                )}
            </Row>
            <Row className='mt-4'>
                <p className='text-justify truncate-3-lines' style={{ fontSize: '10px' }}>
                    Unauthorized access, spamming, or attempts to disrupt the platform&apos;s functionality are strictly
                    prohibited, and violators may face account suspension or legal action. Users are responsible for their
                    conduct and content shared within the platform, respecting others rights and refraining from abusive or
                    offensive behavior.
                </p>
            </Row>
        </Container>
    );
};

export default MessageWindow;
