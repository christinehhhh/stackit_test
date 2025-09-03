import { Request, Response } from 'express'
import { SlackService } from '../services/slackService'
import { StorageService } from '../services/storageService'
import { Notification } from '../types/notification'

const storageService = new StorageService()
const slackService = new SlackService(
  process.env.SLACK_TOKEN!,
  process.env.SLACK_CHANNEL!
)

export const notificationController = {
  createNotification: async (req: Request, res: Response) => {
    try {
      const notification: Notification = req.body

      if (
        !notification.type ||
        !notification.name ||
        !notification.description
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification data',
        })
      }

      if (!['Warning', 'Info'].includes(notification.type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification type',
        })
      }

      console.log('Received notification:', notification)

      storageService.storeNotification(notification)

      if (notification.type === 'Warning') {
        const forwarded = await slackService.forwardNotification(notification)
        console.log('Slack notification forwarded:', forwarded)
      }

      res.status(200).json({
        success: true,
        message: 'Notification received successfully',
        data: notification,
        storedCount: storageService.getNotificationCount(),
      })
    } catch (error) {
      console.error('Error processing notification:', error)
      res.status(500).json({
        success: false,
        message: 'Error processing notification',
      })
    }
  },

  getNotifications: async (req: Request, res: Response) => {
    try {
      const notifications = storageService.getNotifications()
      res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications,
      })
    } catch (error) {
      console.error('Error fetching notifications:', error)
      res.status(500).json({
        success: false,
        message: 'Error fetching notifications',
      })
    }
  },
}
