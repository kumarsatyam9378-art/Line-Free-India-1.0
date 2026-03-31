// src/hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
  data?: any;
}

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: AppNotification[] = [];
      let count = 0;

      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<AppNotification, 'id'>;
        notifs.push({ id: doc.id, ...data });
        if (!data.read) count++;
      });

      // Sort by latest first
      notifs.sort((a, b) => b.createdAt - a.createdAt);

      setNotifications(notifs);
      setUnreadCount(count);
    });

    return () => unsubscribe();
  }, [userId]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (e) {
      console.error('Error marking notification read', e);
    }
  };

  const markAllRead = async () => {
    try {
      const unreadNotifs = notifications.filter(n => !n.read);
      await Promise.all(unreadNotifs.map(n =>
        updateDoc(doc(db, 'notifications', n.id), { read: true })
      ));
    } catch (e) {
      console.error('Error marking all read', e);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (e) {
      console.error('Error deleting notification', e);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    deleteNotification
  };
}
