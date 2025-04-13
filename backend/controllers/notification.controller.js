import Notification from "../models/notification.model.js";

export const getnotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ to: userId }).populate({
            path:'from',
            select:'-password'
        });
        if (!notifications) {
            return res.status(404).json({
                message: "No notifications found",
            });
        }
        await Notification.updateMany({ user: userId }, { $set: { read: true } });
        res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        }); 
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.deleteMany({ to: userId });
        if (!notifications) {
            return res.status(404).json({
                message: "No notifications found",
            });
        }
        res.status(200).json({
            message: "Notifications deleted successfully",
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
        
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;
        const notification = await Notification.findByIdAndDelete(notificationId);
        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
            });
        }
        if(notification.to.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this notification",
            });
        }
        res.status(200).json({
            message: "Notification deleted successfully",
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
        
    }
}