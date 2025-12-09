import { Observable } from 'rxjs';
import { SearchResult, Album } from '../../models/track.model';

export abstract class SpotifyRepository {
    abstract searchAll(query: string): Observable<SearchResult>;
    abstract getPlaylist(id: string): Observable<any>;
    abstract getAlbum(id: string): Observable<Album>;
}
