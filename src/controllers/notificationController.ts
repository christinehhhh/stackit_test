import { Request, Response } from 'express'

export const notificationController = {
  createNotification: async (req: Request, res: Response) => {
    try {
      console.log('Received notification:', req.body)

      res.status(200).json({
        success: true,
        message: 'Notification received successfully',
        data: req.body,
      })
    } catch (error) {
      console.error('Error processing notification:', error)
      res.status(500).json({
        success: false,
        message: 'Error processing notification',
      })
    }
  },
}
