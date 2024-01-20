const Conversation = require('../../models/Conversations');
const Message = require('../../models/Messages');
const User = require('../../models/User');

//* Sending the messages
const sendMessage = async (req, res) => {
    try {

        const { conversationId, senderId, message, receiverId = '' } = req.body;

        if (!senderId || !message) return res.status(400).json({ "message": "Please Enter Sender ID & Message" });

        if (conversationId === 'new' && receiverId) {
            const newConversation = new Conversation({ members: [senderId, receiverId] });
            await newConversation.save();

            const newMessage = new Message({ conversationId: newConversation._id, senderId, message });
            await newMessage.save();

            return res.status(200).json({ "message": "Message send Successfully !" });
        }

        else if (!conversationId && !receiverId) {
            return res.status(400).json({ "message": "Please Fill all required fields !" });
        }

        const newMessage = new Message({ conversationId, senderId, message });
        await newMessage.save();

        return res.status(200).json({ "message": "Message send Successfully !" });

    } catch (error) {
        console.log("Send Message Error ", error);
        res.status(500).json({ "error": error.message });
    }
}

//* Getting all messages linked to the conversation id.....
const getMessages = async (req, res) => {
    try {

        const checkMessages = async (conversationId) => {

            const messages = await Message.find({ conversationId });

            const messageUserData = Promise.all(messages.map(async (message) => {
                const user = await User.findById(message.senderId);

                return { user: { id: user._id, email: user.email, name: user.name, avatarImage: user.avatarImage }, message: message.message }
            }));

            const dataToSend = await messageUserData;
            res.status(200).json(dataToSend);
        }

        const conversationId = req.params.id;
        if (conversationId === 'new') {
            const checkConversation = await Conversation.find({ members: { $all: [req.query.senderId, req.query.receiverId] } });

            if (checkConversation.length > 0) {
                checkConversation(checkConversation[0]._id);
            } else {
                return res.status(200).json([]);
            }
        }
        else {
            checkMessages(conversationId);
        }

    } catch (error) {
        console.log("Get Message Error ", error);
        res.status(500).json({ "error": error.message });
    }
}

//* Creating the new conversation between two users....
const newConversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const newConversation = new Conversation({ members: [senderId, receiverId] });
        await newConversation.save();
        res.status(200).json({ "message": "New Conversation created successfully !" });

    } catch (error) {
        console.log("New Conversation Error ", error);
        res.status(500).json({ "error": error.message });
    }
}

//* Getting all the conversation of specific user by userId....
const getConversations = async (req, res) => {
    try {

        const userId = req.params.id;
        const conversations = await Conversation.find({ members: { $in: [userId] } });

        const conversationUserData = Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await User.findById(receiverId);

            return { user: { receiverId: user._id, email: user.email, name: user.name, avatarImage: user.avatarImage }, conversationId: conversation._id }
        }));

        const dataToSend = await conversationUserData;

        res.status(200).json(dataToSend);

    } catch (error) {
        console.log("Fetch Conversations Error ", error);
        res.status(500).json({ "error": error.message });
    }
}

module.exports = { sendMessage, getMessages, newConversation, getConversations };