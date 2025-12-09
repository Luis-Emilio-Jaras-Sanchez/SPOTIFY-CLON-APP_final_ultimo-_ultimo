export interface Track {
    id: string;
    name: string;
    preview_url?: string;
    duration_ms: number;
    popularity?: number;
    artists: Artist[];
    album: Album;
    external_urls?: {
        spotify?: string;
    };
    // Merged optional fields from other interface just in case
    uri?: string;
    type?: string;
    track_number?: number;
}

export interface Artist {
    id: string;
    name: string;
    images?: Image[]; // Added based on usage in search.ts (artist.images)
}

export interface Album {
    id: string;
    name: string;
    images: Image[];
    artists?: Artist[];
    tracks?: Track[]; // Added to support Album details where tracks are listed
}

export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface SearchResult {
    tracks: Track[];
    albums: Album[];
    artists: Artist[];
}
