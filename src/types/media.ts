export interface DestinationMedia {
  destinationId: string;
  coverUrl?: string;
  videoUrl?: string;
  updatedAt: string;
}
export interface MediaCatalog { media: DestinationMedia[]; isAdmin: boolean }
