import { Component, input } from '@angular/core';

import { Track } from '../domain/models/track.model';
import { Image } from '../domain/models/track.model'; // Assuming Image is exported from there or similar
import { AudioRepository } from '../domain/ports/out/audio.repository';

@Component({
  selector: 'app-playlist',
  standalone: false,
  templateUrl: './playlist.html',
  styleUrl: './playlist.css'
})
export class Playlist {

  playlist = input.required<Track[] | undefined>();
  cover = input.required<Image | undefined>();

  constructor(private _audioPlayer: AudioRepository) { }

  playTrack(track: Track): void {
    const currentPlaylist = this.playlist();
    if (currentPlaylist) {
      this._audioPlayer.setPlaylist(currentPlaylist);
      this._audioPlayer.playTrack(track);
    }
  }

  formatDuration(duration: number): string {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  isCurrentTrack(track: Track): boolean {
    // Implementaremos esto cuando tengamos acceso al track actual
    return false;
  }
}
