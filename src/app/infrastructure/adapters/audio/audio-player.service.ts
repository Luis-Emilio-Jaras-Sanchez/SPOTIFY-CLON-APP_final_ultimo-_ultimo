import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AudioRepository } from '../../../domain/ports/out/audio.repository';
import { Track } from '../../../domain/models/track.model';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService implements AudioRepository {
    private audio = new Audio();
    private playlist: Track[] = [];
    private currentTrackIndex = 0;

    private currentTrackSubject = new BehaviorSubject<Track | null>(null);
    private isPlayingSubject = new BehaviorSubject<boolean>(false);
    private currentTimeSubject = new BehaviorSubject<number>(0);
    private durationSubject = new BehaviorSubject<number>(0);
    private volumeSubject = new BehaviorSubject<number>(0.7);

    currentTrack$ = this.currentTrackSubject.asObservable();
    isPlaying$ = this.isPlayingSubject.asObservable();
    currentTime$ = this.currentTimeSubject.asObservable();
    duration$ = this.durationSubject.asObservable();
    volume$ = this.volumeSubject.asObservable();

    constructor() { this.setupAudioEvents(); }

    private setupAudioEvents(): void {
        this.audio.addEventListener('loadedmetadata', () => this.durationSubject.next(this.audio.duration));
        this.audio.addEventListener('timeupdate', () => this.currentTimeSubject.next(this.audio.currentTime));
        this.audio.addEventListener('ended', () => this.next());
        this.audio.addEventListener('play', () => this.isPlayingSubject.next(true));
        this.audio.addEventListener('pause', () => this.isPlayingSubject.next(false));
        this.audio.addEventListener('error', () => {
            console.error('Error de reproducción de audio');
            this.isPlayingSubject.next(false);
        });
    }

    setPlaylist(tracks: Track[]): void { this.playlist = tracks; this.currentTrackIndex = 0; }

    playTrack(track: Track): void {
        const trackIndex = this.playlist.findIndex(t => t.id === track.id);
        this.currentTrackIndex = trackIndex !== -1 ? trackIndex : (this.playlist = [track], 0);
        this.loadAndPlay(track);
    }

    private loadAndPlay(track: Track): void {
        this.currentTrackSubject.next(track);
        this.pause();

        if (track.preview_url) {
            this.audio.src = track.preview_url;
            this.audio.crossOrigin = 'anonymous';
            this.audio.load();
            this.audio.play().catch(err => {
                console.warn('No se pudo reproducir la pista', err);
                this.isPlayingSubject.next(false);
            });
        } else {
            console.warn('No hay URL de vista previa para la pista:', track.name);
            // No do not play anything if no preview
        }
    }

    togglePlayPause(): void {
        if (this.isPlayingSubject.value) {
            this.pause();
        } else {
            this.play();
        }
    }

    play(): void {
        if (this.audio.src) {
            this.audio.play().catch(err => console.warn('Error de reproducción:', err));
        }
    }

    pause(): void {
        this.audio.pause();
        this.isPlayingSubject.next(false);
    }

    next(): void {
        if (!this.playlist.length) return;
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadAndPlay(this.playlist[this.currentTrackIndex]);
    }

    previous(): void {
        if (!this.playlist.length) return;
        this.currentTrackIndex = this.currentTrackIndex === 0 ? this.playlist.length - 1 : this.currentTrackIndex - 1;
        this.loadAndPlay(this.playlist[this.currentTrackIndex]);
    }

    seekTo(time: number): void { this.audio.currentTime = time; }
    setVolume(volume: number): void { this.audio.volume = Math.max(0, Math.min(1, volume)); this.volumeSubject.next(this.audio.volume); }
    getVolume(): number { return this.audio.volume; }
    getCurrentTrack(): Track | null { return this.currentTrackSubject.value; }
    isPlaying(): boolean { return this.isPlayingSubject.value; }
    getCurrentTime(): number { return this.audio.currentTime; }
    getDuration(): number { return this.audio.duration || 0; }
    getPlaylistInfo(): { current: number; total: number } {
        return { current: this.currentTrackIndex, total: this.playlist.length };
    }
    getCurrentTrackInfo(): Track | null {
        return this.currentTrackSubject.value;
    }

    formatTime(seconds: number): string {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
