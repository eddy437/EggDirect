import { prisma } from '@/lib/prisma';
import type { Notification } from '@/types';

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: Record<string, unknown>
): Promise<Notification> {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type: type as any,
      title,
      message,
      data: data ? JSON.stringify(data) : null,
    },
  });

  return notification as Notification;
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return notifications as Notification[];
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}
