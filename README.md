# Notification Forwarding Service

## Overview

- REST service that accepts notifications and forwards only Warning-type messages to Slack
- Stores notifications in memory. Includes integration tests

## Tech Stack

- Node.js, TypeScript, Express
- Slack Web API (forwarding)
- Jest + Supertest (tests)

## Getting Started

### Install

```bash
npm install
```

### Environment

- Development variables go in .env.development (git-ignored).
- Example:

```env
NODE_ENV=development
PORT=3000
SLACK_TOKEN=your-bot-token
SLACK_CHANNEL_ID=your-channel-id
```

### Run (development)

```bash
npm run dev
```

Server starts on PORT (default 3000).

### Run (production-ish)

```bash
npm start
```

### Test

```bash
npm test
```

## Notes

- Tests mock Slack; no external calls.
- The server is not started during tests; Supertest uses the Express app directly.

## API

- Base path: /api/v1/notification

### POST /

- Description: Accepts a notification; stores it; forwards to Slack if Type/ type is "Warning".
- Request JSON (lowercase supported by current controller):

```json
{
  "type": "Warning | Info",
  "name": "string",
  "description": "string",
  "...": "any additional fields"
}
```

- Responses:
  - 200 OK

  ```json
  {
    "success": true,
    "message": "Notification received successfully",
    "data": { },
    "storedCount": 1,
    "forwarded": true
  }
  ```

  - 400 Bad Request (validation errors)

  ```json
  { "success": false, "message": "Invalid notification data | Invalid notification type" }
  ```

### GET /

- Description: Returns all stored notifications.
- Response:

```json
{
  "success": true,
  "count": 3,
  "data": []
}
```

## Curl Examples

```bash
# Warning (will be forwarded)
curl -s -X POST http://localhost:3000/api/v1/notification \
  -H 'Content-Type: application/json' \
  -d '{"type":"Warning","name":"Backup Failure","description":"DB problem"}'

# Info (will NOT be forwarded)
curl -s -X POST http://localhost:3000/api/v1/notification \
  -H 'Content-Type: application/json' \
  -d '{"type":"Info","name":"Quota Exceeded","description":"Compute quota"}'

# Fetch stored notifications
curl -s http://localhost:3000/api/v1/notification
```

## Slack Setup (summary)

1. Create a Slack app → OAuth & Permissions → add scopes: chat:write, channels:read.
2. Install to workspace; copy Bot User OAuth Token (xoxb-...).
3. Invite the bot to your target channel.
4. Set SLACK_TOKEN and SLACK_CHANNEL_ID in your env file.

## Environment Management

- server loads .env.development when NODE_ENV=development, else .env.
- Tests set NODE_ENV=test and mock Slack; no real tokens needed.

## Project Scripts

- npm run dev: start with nodemon in development
- npm start: start app
- npm test: run jest

## Notes / Decisions

- In-memory storage satisfies the challenge constraint (no DB).
- Controller accepts lowercase keys (type/name/description) for convenience.
- Slack forwarding is isolated behind a service for easy mocking and future changes.
