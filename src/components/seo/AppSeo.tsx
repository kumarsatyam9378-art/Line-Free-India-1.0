import { useEffect } from 'react';

interface AppSeoProps {
  title?: string;
  description?: string;
}

export default function AppSeo({
  title = 'Line Free India | Skip queues, book instantly',
  description = 'Line Free India helps customers skip waiting lines across salons and local businesses with real-time queue tracking.',
}: AppSeoProps) {
  useEffect(() => {
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
  }, [title, description]);

  return null;
}
