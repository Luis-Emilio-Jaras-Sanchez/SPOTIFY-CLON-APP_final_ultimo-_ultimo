import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SpotifyRepository } from '../../../domain/ports/out/spotify.repository';
import { SearchResult, Track, Album } from '../../../domain/models/track.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SpotifyApiService implements SpotifyRepository {

    constructor(private http: HttpClient) { }

    searchAll(query: string): Observable<SearchResult> {
        if (!query || query.length < 2) {
            return of({ tracks: [], albums: [], artists: [] });
        }

        return this.http.get<any>(`${environment.API_URL}/search`, {
            params: {
                q: query,
                type: 'track,album,artist',
                limit: '10',
                market: 'US'
            }
        }).pipe(
            map(response => {
                const tracks = response.tracks?.items || [];
                const albums = response.albums?.items || [];
                const artists = response.artists?.items || [];

                const tracksWithPreview = tracks.filter((t: any) => t.preview_url);
                const tracksWithoutPreview = tracks.filter((t: any) => !t.preview_url);

                return {
                    tracks: [...tracksWithPreview, ...tracksWithoutPreview],
                    albums: albums,
                    artists: artists
                };
            }),
            catchError((error) => {
                console.error('Error obteniendo resultados de búsqueda', error);
                return of({ tracks: [], albums: [], artists: [] });
            })
        );
    }

    getPlaylist(id: string): Observable<any> {
        return this.http.get<any>(`${environment.API_URL}/playlists/${id}`).pipe(
            map(response => {
                if (response && response.tracks && response.tracks.items) {
                    response.tracks = response.tracks.items.map((item: any) => item.track).filter((t: any) => t);
                }
                return response;
            }),
            catchError((error) => {
                console.error('Error obteniendo lista de reproducción', error);
                return of(null);
            })
        );
    }

    getAlbum(id: string): Observable<Album> {
        return this.http.get<any>(`${environment.API_URL}/albums/${id}`).pipe(
            map(apiresponse => ({
                id: apiresponse.id,
                name: apiresponse.name,
                images: apiresponse.images.map((image: any) => ({ width: image.width, height: image.height, url: image.url })),
                tracks: apiresponse.tracks.items.map((track: any) => ({
                    id: track.id,
                    name: track.name,
                    duration_ms: track.duration_ms,
                    artists: track.artists.map((artist: any) => ({ id: artist.id, name: artist.name })),
                    album: { id: apiresponse.id, name: apiresponse.name, images: apiresponse.images }
                }))
            })),
            catchError((error) => {
                console.error('Error obteniendo álbum', error);
                return of(null as any);
            })
        );
    }
}
