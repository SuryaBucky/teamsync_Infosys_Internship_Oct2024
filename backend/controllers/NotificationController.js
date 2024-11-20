const {Notification} = require("../db/index"); 
require("dotenv").config();

const getUnreadMessagesByProject = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Validate user_id
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
        }

        // Fetch all notifications for the user
        const unreadMessages = await Notification.find(
            { user_id },
            { project_id: 1, unread_messages: 1, _id: 0 } // Select only necessary fields
        );

        res.status(200).json(unreadMessages);

    } catch (error) {
        console.error('Error fetching unread messages by project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch unread messages',
        });
    }
};
const getTotalUnreadMessages = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Validate user_id
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
        }

        // Sum the unread_messages directly from the database
        const notifications = await Notification.find({ user_id });

        // Calculate total unread count
        const totalUnreadCount = notifications.reduce(
            (total, notification) => total + notification.unread_messages,
            0
        );

        res.status(200).json({
            success: true,
            total_unread: totalUnreadCount,
        });
    } catch (error) {
        console.error('Error fetching total unread messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch total unread messages',
        });
    }
};

// Mark all unread messages as read for a user and a project
const markMessagesAsRead = async (req, res) => {
    const { project_id } = req.body; // Extract the project ID from the request body
    const user_id = req.user.id; // Extract the user ID from authenticated middleware
  
    try {
      const result = await Notification.findOneAndUpdate(
        { project_id, user_id },
        { unread_count: 0 }, // Set unread_count to 0
        { new: true } // Return the updated document
      );
  
      if (!result) {
        return res.status(404).json({ message: 'No unread messages found for this project.' });
      }
  
      res.status(200).json({ message: 'Unread messages marked as read.', notification: result });
    } catch (error) {
      console.error('Error updating unread messages:', error);
      res.status(500).json({ message: 'Failed to mark messages as read.', error });
    }
};

module.exports = {getUnreadMessagesByProject, getTotalUnreadMessages,markMessagesAsRead}