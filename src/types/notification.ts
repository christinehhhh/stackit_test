export interface Notification {
  type: 'Warning' | 'Info'
  name: string
  description: string
  [key: string]: any
}
