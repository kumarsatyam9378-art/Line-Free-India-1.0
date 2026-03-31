// src/utils/shareHelpers.ts
import { toast } from 'react-hot-toast';

export const generateDeepLink = (businessId: string) => {
  return `https://linefree.in/b/${businessId}`;
};

export const shareContent = async (title: string, text: string, url: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return true;
    } catch (error) {
      console.log('Error sharing:', error);
      // Fallback
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    toast.success('Link copied to clipboard!');
    return true;
  } catch (err) {
    console.error('Could not copy text: ', err);
    toast.error('Failed to copy link');
    return false;
  }
};
