export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_completed'
  | 'booking_reminder'
  | 'new_review'
  | 'promotional';

export interface Notification {
  id: string;
  userId: string; // Could be customerId or ownerId
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: any;
}