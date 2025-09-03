jest.mock('../../services/slackService')

import request from 'supertest'
import app from '../../app'

describe('Notification API Integration Tests', () => {
  describe('POST /api/v1/notification', () => {
    it('should accept and store a valid Warning notification', async () => {
      const notification = {
        type: 'Warning',
        name: 'Test Warning',
        description: 'This is a test warning',
      }

      const response = await request(app)
        .post('/api/v1/notification')
        .send(notification)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toEqual(notification)
      expect(response.body.storedCount).toBeGreaterThan(0)
    })

    it('should accept and store a valid Info notification', async () => {
      const notification = {
        type: 'Info',
        name: 'Test Info',
        description: 'This is a test info',
      }

      const response = await request(app)
        .post('/api/v1/notification')
        .send(notification)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toEqual(notification)
      expect(response.body.storedCount).toBeGreaterThan(0)
    })

    it('should reject notification with invalid type', async () => {
      const notification = {
        type: 'Error',
        name: 'Test Error',
        description: 'This is a invalid type',
      }

      const response = await request(app)
        .post('/api/v1/notification')
        .send(notification)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toEqual('Invalid notification type')
    })

    it('should reject notification with missing required fields', async () => {
      const notification = {
        type: 'Warning',
        description: 'This is a test warning',
      }

      const response = await request(app)
        .post('/api/v1/notification')
        .send(notification)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toEqual('Invalid notification data')
    })
  })

  describe('GET /api/v1/notification', () => {
    it('should return all notifications', async () => {
      const response = await request(app)
        .get('/api/v1/notification')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(typeof response.body.count).toBe('number')
    })
  })

  describe('Notification Forwarding to Slack', () => {
    it('should forward Warning notifications to Slack', async () => {
      const notification = {
        type: 'Warning',
        name: 'Test Warning',
        description: 'This is a test warning',
      }

      const response = await request(app)
        .post('/api/v1/notification')
        .send(notification)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.forwarded).toBe(true)
    })

    it('should not forward Info notifications to Slack', async () => {
      const notification = {
        type: 'Info',
        name: 'Test Info',
        description: 'This is a test info',
      }

      const response = await request(app)
        .post('/api/v1/notification')
        .send(notification)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.forwarded).toBe(false)
    })
  })
})
