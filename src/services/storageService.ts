import { Notification } from '../types/notification'

export class StorageService {
  private notifications: Notification[] = []

  storeNotification(notification: Notification) {
    this.notifications.push({
      ...notification,
      timestamp: new Date().toISOString(),
    })
  }

  getNotifications(): Notification[] {
    return [...this.notifications]
  }

  getNotificationByType(type: Notification['type']): Notification[] {
    return this.notifications.filter((n) => n.type === type)
  }

  getNotificationCount(): number {
    return this.notifications.length
  }
}
