const { Server } = require('socket.io');
const User = require('../models/User');
const Conversation = require('../models/Conversations');
const Message = require('../models/Messages');

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();


const socket = (expressServer) => {

    let users = [];

    const io = new Server(expressServer, {
        cors: {
            origin: '*',
        }
    });

    io.on('connection', socket => {
       

        socket.on('addUser', async (userId) => {
            

            const isuserexists = users.find((user) => user.userId === userId.userID);

            if (!isuserexists) {
                const userData = await User.findOne({ _id: userId.userID });
                users.push({ userData: { _id: userId.userID, name: userData.name, email: userData.email, avatarImage: userData.avatarImage }, socketId: socket.id })
            }

            io.emit('userList', users);
        });

        socket.on('addConversation', async ({ id, userId }) => {

            try {
                const currentUser = await User.findOne({ _id: id });
                const userData = await User.findOne({ _id: userId });

                const conversationExists = currentUser.conversations.find((conversation) => conversation._id === userId);
                
                if (!conversationExists) {
                    currentUser.conversations.push({ _id: userId, name: userData.name, email: userData.email, avatarImage: userData.avatarImage });
                    await currentUser.save();
                }

                const otheruserConversationExists = userData.conversations.find((conversation) => conversation._id === id);
                
                if (!otheruserConversationExists) {
                    userData.conversations.push({ _id: id, name: currentUser.name, email: currentUser.email, avatarImage: currentUser.avatarImage });
                    await userData.save();
                }

                socket.emit('conversationAdded', currentUser.conversations);
                io.to(userId).emit('conversationAdded', userData.conversations);
            } catch (error) {
                console.log(error);
            }
        })



        socket.on('sendMessage', async ({ senderId, receiverId, text }) => {

            let conversation = await Conversation.findOne({
                members: { $all: [senderId, receiverId] }
            });

            if (!conversation) {
                conversation = await Conversation({
                    members: [senderId, receiverId]
                });
                await conversation.save();
            }


            const message = new Message({ conversationId: conversation._id, senderId, message: text });
            await message.save();

            const receiverSocket = users.find((user) => user.userData._id === receiverId);
            console.log(receiverSocket);
            //! send message to receiver 

            if (receiverSocket) {
                io.to(receiverSocket.socketId).emit('receiverMessage', { conversationId: conversation._id, senderId, text });
            }

        });

        socket.on('getMessages', async ({ senderId, receiverId }) => {
            const conversation = await Conversation.findOne({
                members: { $all: [senderId, receiverId] }
            });

            console.log(conversation);


            if (conversation) {
                const messages = await Message.find({ conversationId: conversation._id });
                //! Emitting the message to the requested client only
                io.to(socket.id).emit('messages', { conversationId: conversation._id, messages });
            }
        });

        socket.on('activity', ({ userId, receiverId }) => {
            //! Broadcasting that specific user only about the current user activity..... :)

            const receiverSocket = users.find((user) => user.userId === receiverId);

            if (receiverSocket) {
                io.to(receiverSocket.socketId).emit('userActivity', {
                    userId, activity: 'typing'
                });
            }

        });


        //* Video calling socket integration starts here.............................

        socket.on('room:join', (data) => {
            const { email, room } = data;

            console.log("Room Joined !");

            emailToSocketIdMap.set(email, socket.id);
            socketIdToEmailMap.set(socket.id, email);

            io.to(room).emit('user:joined', { email, id: socket.id });
            socket.join(room);

            io.to(socket.id).emit('room:join', data);
        });

        socket.on('user:call', ({ to, offer }) => {
            io.to(to).emit("incoming:call", {
                from: socket.id, offer
            });
        });

        socket.on("call:accepted", ({ to, ans }) => {
            io.to(to).emit("call:accepted", {
                from: socket.id, ans
            });
        });

        socket.on("peer:nego:needed", ({ to, offer }) => {
            io.to(to).emit('peer:nego:needed', { from: socket.id, offer });
        });

        socket.on("peer:nego:done", ({ to, ans }) => {
            io.to(to).emit('peer:nego:final', { from: socket.id, ans });
        });

        //*------------------------------------------------------------------------

        socket.on('disconnect', ({ userId }) => {
            //! Remove the user from the users array....

            const user = users.find((user) => user.userId === userId);
            if (user) {
                users = users.filter((user) => user.userId !== userId);
                io.emit('userList', users.map((user) => user.userId));

                console.log(`${socket.id} disconnected`);
            }
        })

    });
}

module.exports = socket;