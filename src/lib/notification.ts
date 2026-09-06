// Notification Provider Abstraction
export interface NotificationProvider {
  sendSMS(phoneNumber: string, message: string): Promise<void>;
  sendPushNotification(userId: string, title: string, body: string): Promise<void>;
  sendEmail(email: string, subject: string, html: string): Promise<void>;
}

// Mock Notification Provider (for development)
export class MockNotificationProvider implements NotificationProvider {
  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    console.log(`Mock: SMS to ${phoneNumber}: ${message}`);
  }

  async sendPushNotification(userId: string, title: string, body: string): Promise<void> {
    console.log(`Mock: Push notification to ${userId}: ${title} - ${body}`);
  }

  async sendEmail(email: string, subject: string, html: string): Promise<void> {
    console.log(`Mock: Email to ${email}: ${subject}`);
  }
}

let notificationProvider: NotificationProvider | null = null;

export function getNotificationProvider(): NotificationProvider {
  if (!notificationProvider) {
    const provider = process.env.NOTIFICATION_PROVIDER || 'mock';
    if (provider === 'mock') {
      notificationProvider = new MockNotificationProvider();
    } else {
      notificationProvider = new MockNotificationProvider();
    }
  }
  return notificationProvider;
}
