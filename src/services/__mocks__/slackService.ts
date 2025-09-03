export class SlackService {
  constructor(..._args: any[]) {}
  forwardNotification = jest.fn(async (n: any) => n?.type === 'Warning')
}
