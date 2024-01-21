const { Server } = require('socket.io');
const User = require('../models/User');
const Conversation = require('../models/Conversations');
const Message = require('../models/Messages');


const socket = (expressServer) => {

    let users = [];

    const io = new Server(expressServer, {
        cors: {
            origin: '*',
        }
    });

    io.on('connection', socket => {
        console.log(`${socket.id} connected`);

        socket.on('addUser', async (userId) => {
            console.log(userId);

            const isuserexists = users.find((user) => user.userId === userId.userID);

            if (!isuserexists) {
                const userData = await User.findOne({ _id: userId.userID });
                users.push({ userData: { _id: userId.userID, name: userData.name, email: userData.name, avatarImage: userData.avatarImage }, socketId: socket.id })
            }

            io.emit('userList', users);
        });



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
            //! Broadcasting that specific user only about the current user activity.....

            const receiverSocket = users.find((user) => user.userId === receiverId);

            if (receiverSocket) {
                io.to(receiverSocket.socketId).emit('userActivity', {
                    userId, activity: 'typing'
                });
            }

        })

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