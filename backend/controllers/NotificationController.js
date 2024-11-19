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

module.exports = {getUnreadMessagesByProject, getTotalUnreadMessages}