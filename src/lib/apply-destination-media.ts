import type { Destination } from '@/types';
import type { DestinationMedia } from '@/types/media';

export function applyDestinationMedia(destinations: Destination[], media: DestinationMedia[]): Destination[] {
  return destinations.map(destination => {
    const current = media.find(item => item.destinationId === destination.id);
    if (!current) return destination;
    return { ...destination, coverImage: current.coverUrl ?? destination.coverImage, videoTrailer: {
      ...destination.videoTrailer,
      videoUrl: current.videoUrl ?? destination.videoTrailer.videoUrl,
      ...(current.videoUrl ? { youtubeEmbedId: undefined } : {}),
      scenes: destination.videoTrailer.scenes.map((scene,index) => index === 0 && current.coverUrl ? { ...scene,image: current.coverUrl } : scene),
    } };
  });
}
