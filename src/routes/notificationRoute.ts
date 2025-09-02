import express from 'express'
import { notificationController } from '../controllers/notificationController'

const router = express.Router()

router.route('/').post(notificationController.createNotification)
router.route('/').get(notificationController.getNotifications)

export default router
