// server/controllers/messageController.js
const Message = require('../models/Message');
const User = require('../models/User');

/**
 * @desc  Send a message
 * @route POST /api/messages
 * @access Private
 */
const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  if (!receiverId || !content) {
    return res.status(400).json({ message: 'Receiver and content are required' });
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) return res.status(404).json({ message: 'Receiver not found' });

  const message = await Message.create({
    senderId: req.user._id,
    receiverId,
    content,
  });

  await message.populate('senderId', 'name avatar');
  res.status(201).json(message);
};

/**
 * @desc  Get conversation between two users
 * @route GET /api/messages/:userId
 * @access Private
 */
const getConversation = async (req, res) => {
  const messages = await Message.find({
    $or: [
      { senderId: req.user._id, receiverId: req.params.userId },
      { senderId: req.params.userId, receiverId: req.user._id },
    ],
  })
    .populate('senderId', 'name avatar')
    .populate('receiverId', 'name avatar')
    .sort({ createdAt: 1 });

  // Mark received messages as read
  await Message.updateMany(
    { senderId: req.params.userId, receiverId: req.user._id, read: false },
    { read: true }
  );

  res.json(messages);
};

/**
 * @desc  Get all conversations (inbox) for current user
 * @route GET /api/messages/inbox
 * @access Private
 */
const getInbox = async (req, res) => {
  // Get distinct users this user has conversed with
  const sent = await Message.distinct('receiverId', { senderId: req.user._id });
  const received = await Message.distinct('senderId', { receiverId: req.user._id });
  const allUserIds = [...new Set([...sent.map(String), ...received.map(String)])].filter(
    (id) => id !== req.user._id.toString()
  );

  const users = await User.find({ _id: { $in: allUserIds } }).select('name avatar email role');

  // Get unread counts
  const result = await Promise.all(
    users.map(async (u) => {
      const unread = await Message.countDocuments({
        senderId: u._id,
        receiverId: req.user._id,
        read: false,
      });
      const lastMessage = await Message.findOne({
        $or: [
          { senderId: req.user._id, receiverId: u._id },
          { senderId: u._id, receiverId: req.user._id },
        ],
      }).sort({ createdAt: -1 });
      return { user: u, unread, lastMessage };
    })
  );

  res.json(result);
};

module.exports = { sendMessage, getConversation, getInbox };
