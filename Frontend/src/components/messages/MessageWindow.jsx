import { useRef, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Button, Overlay, Tooltip, ButtonGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import { useMediaQuery } from 'react-responsive';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import toast, { Toaster } from 'react-hot-toast';
import VideoNotification from '../VideoCall/VideoNotification';
import { useNavigate } from 'react-router-dom';
import VideoRoom from '../VideoCall/VideoRoom';
import Input from '../inputs/Input';
import { selectCurrentUser } from '../../store/Authentication/authSlice';

const MessageWindow = () => {

    /*  const newSocket = useSocket(); */

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
    const currentUser = useSelector(selectCurrentUser);
    const [receiverId, setReceiverId] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userList, setUserList] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [receiverSocketId, setReceiverSocketId] = useState(null);

    const [conversationsList, setConversationsList] = useState([]);
    const [joined, setJoined] = useState(false);

    const scrollRef = useRef();

    useEffect(() => {
        setConversationsList(currentUser?.conversations);
    }, [currentUser]);

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
            setMessages(messages);
        });

        newSocket.on('conversationAdded', (conversationsList) => {
            setConversationsList(conversationsList);
        })

        newSocket.on("incomingcall", ({ callerId, callername, callerImage }) => {
            console.log(callerId, callername, callerImage)
            toast((t) => (
                <VideoNotification userId={callerId} username={callername} userImage={callerImage} toast={t}
                    videoCall={setJoined}
                />
            ), { duration: 5000 });
        });

        newSocket.on('endcall', () => {
            setJoined(false);
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

            socket.emit('addConversation', { id: currentUser._id, userId: receiverId });
            socket.emit('sendMessage', newMessage);
            setMessages((prevMessages) => [...prevMessages, { conversationId, senderId: currentUser?._id, message }]);
            setMessage('');
        }
    };



    const handleJoinVideoRoom = () => {
        socket.emit('calling', {
            callerId: currentUser._id, receiverId: receiverSocketId,
            callername: currentUser.name, callerImage: currentUser.avatarImage
        });
        console.log(currentUser._id, receiverSocketId);

        setJoined(true);
    };

    const [toggleList, setToggleList] = useState(true);
    const handleToggle = () => setToggleList(prev => !prev);

    return (
        <Container fluid className='mt-lg-4 mt-auto px-lg-5'>
            <Toaster position="top-right" />
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

                            <ButtonGroup className='d-flex align-items-center justify-content-center'>
                                <Button variant='light' className={`fw-bolder link-offset-2 ${toggleList ? 'text-decoration-underline' : ''}`} onClick={handleToggle}>Conversations</Button>
                                <Button variant='light' className={`fw-bolder link-offset-2 ${toggleList ? '' : 'text-decoration-underline'}`} onClick={handleToggle}>Online</Button>
                            </ButtonGroup>


                            {!toggleList && userList && userList?.map((x) => (
                                <div key={x.socketId} className='d-flex mt-2 border-bottom py-2' style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setSelected(!selected);
                                        setSelectedUser(x.userData);
                                        setReceiverId(x.userData._id);
                                        setReceiverSocketId(x.socketId);
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

                            {toggleList && conversationsList && conversationsList?.map((x, i) =>

                                <div key={i} className='d-flex mt-2 border-bottom py-2' style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setSelected(!selected);
                                        setSelectedUser(x);
                                        setReceiverId(x._id);
                                        getMessages();
                                        setMobileComponent(!mobileComponent);
                                    }}
                                >
                                    <img src={x.avatarImage} style={{ width: '60px' }} alt={`Avatar of ${x.name}`} />
                                    <div className='ms-2'>
                                        <h6 className='fw-bolder'>{x.name}</h6>
                                        <h6 className='fw-bolder '>{x.email}</h6>
                                    </div>
                                </div>
                            )}


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
                            <Button variant='light' onClick={handleJoinVideoRoom}><i className="fa-solid fa-video fs-5"></i></Button>
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
                                inputClassName='form-control py-2 rounded-3 border-black'
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

            <Row>
                {joined &&
                    <Modal show={joined} fullscreen={true} onHide={() => {
                        setJoined(false);
                        socket.emit('endcall', { receiverId: receiverSocketId });
                    }}>
                        <Modal.Header>
                            <Modal.Title className='d-flex align-items-center'>
                                <h6 className='fw-bolder'>Powered by</h6>
                                <img
                                    src="https://i.ibb.co/Rc3zJKt/Screenshot-2024-01-08-202059.png"
                                    style={{ height: '20px', cursor: 'pointer' }}
                                    className="d-inline-block align-top ms-2"
                                    alt="Your Logo"
                                />
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <VideoRoom socket={socket} setJoined={setJoined} />
                        </Modal.Body>
                    </Modal>
                }
            </Row>
        </Container>
    );
};

export default MessageWindow;
