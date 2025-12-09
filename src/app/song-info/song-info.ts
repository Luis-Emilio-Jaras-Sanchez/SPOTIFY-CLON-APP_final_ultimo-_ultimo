import { Component, input } from '@angular/core';
import { Track } from '../domain/models/track.model';
import { Image } from '../domain/models/track.model';

@Component({
  selector: 'app-song-info',
  standalone: false,
  templateUrl: './song-info.html',
  styleUrl: './song-info.css',
  host: {
    '[class]': 'displayMode()',
  }
})
export class SongInfo {
  display_mode = input.required<string>({ alias: 'displayMode' });
  song = input.required<Track | undefined>();
  cover = input.required<Image | undefined>();

  displayMode() {
    return this.display_mode();
  }
}
