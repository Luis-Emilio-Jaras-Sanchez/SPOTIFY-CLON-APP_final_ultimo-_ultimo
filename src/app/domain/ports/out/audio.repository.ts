import { Observable } from 'rxjs';
import { Track } from '../../models/track.model';

export abstract class AudioRepository {
    abstract currentTrack$: Observable<Track | null>;
    abstract isPlaying$: Observable<boolean>;
    abstract currentTime$: Observable<number>;
    abstract duration$: Observable<number>;
    abstract volume$: Observable<number>;

    abstract setPlaylist(tracks: Track[]): void;
    abstract playTrack(track: Track): void;
    abstract togglePlayPause(): void;
    abstract play(): void;
    abstract pause(): void;
    abstract next(): void;
    abstract previous(): void;
    abstract seekTo(time: number): void;
    abstract setVolume(volume: number): void;
    abstract getVolume(): number;
    abstract getCurrentTrack(): Track | null;
    abstract isPlaying(): boolean;
    abstract getCurrentTime(): number;
    abstract getDuration(): number;
    abstract getPlaylistInfo(): { current: number; total: number };
    abstract getCurrentTrackInfo(): Track | null;
    abstract formatTime(seconds: number): string;
}
