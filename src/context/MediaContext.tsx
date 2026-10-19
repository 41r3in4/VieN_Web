'use client';

import { createContext,useContext,useEffect,useMemo,useState,useCallback,type ReactNode } from 'react';
import { DESTINATIONS } from '@/data/destinations';
import { applyDestinationMedia } from '@/lib/apply-destination-media';
import type { Destination } from '@/types';
import type { MediaCatalog } from '@/types/media';

interface MediaContextValue {
  destinations: Destination[];
  catalog: MediaCatalog;
  editingDestinationId: string | null;
  openMediaEditor: (id: string) => void;
  closeMediaEditor: () => void;
  updateCatalog: (catalog: MediaCatalog) => void;
}
const MediaContext = createContext<MediaContextValue | undefined>(undefined);
export function MediaProvider({ initialCatalog,children }: { initialCatalog: MediaCatalog; children: ReactNode }) {
  const [catalog,updateCatalog] = useState(initialCatalog);
  const [editingDestinationId,setEditingDestinationId] = useState<string | null>(null);
  const destinations = useMemo(() => applyDestinationMedia(DESTINATIONS,catalog.media),[catalog.media]);
  useEffect(() => {
    let alive = true;
    let pending = false;
    const refresh = async () => {
      if (document.hidden || pending) return;
      pending = true;
      try {
        const response = await fetch('/api/media/catalog',{ cache: 'no-store' });
        if (response.ok && alive) updateCatalog(await response.json());
      } catch { /* retain last published media */ }
      finally { pending = false; }
    };
    const timer = setInterval(refresh,20000);
    window.addEventListener('focus',refresh);
    return () => { alive = false; clearInterval(timer); window.removeEventListener('focus',refresh); };
  },[]);
  const openMediaEditor = useCallback((id: string) => { if (catalog.isAdmin) setEditingDestinationId(id); },[catalog.isAdmin]);
  const closeMediaEditor = useCallback(() => setEditingDestinationId(null),[]);
  return <MediaContext.Provider value={{ destinations,catalog,editingDestinationId,openMediaEditor,closeMediaEditor,updateCatalog }}>{children}</MediaContext.Provider>;
}
export function useMedia() {
  const value = useContext(MediaContext);
  if (!value) throw new Error('MediaProvider is required');
  return value;
}
