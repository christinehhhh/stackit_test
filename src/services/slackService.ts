import { WebClient } from '@slack/web-api'
import { Notification } from '../types/notification'

export class SlackService {
  private client: WebClient
  private channelId: string

  constructor(token: string, channelId: string) {
    this.client = new WebClient(token)
    this.channelId = channelId
  }

  async forwardNotification(notification: Notification): Promise<boolean> {
    try {
      if (notification.type !== 'Warning') {
        return false
      }

      const message = `🚨 *${notification.name}* \n ${notification.description}`
      await this.client.chat.postMessage({
        channel: this.channelId,
        text: message,
      })

      return true
    } catch (error) {
      console.error('Failed to forward to Slack:', error)
      return false
    }
  }
}
