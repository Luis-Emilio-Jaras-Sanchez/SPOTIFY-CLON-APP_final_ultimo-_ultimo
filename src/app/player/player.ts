import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyRepository } from '../domain/ports/out/spotify.repository';
import { Album } from '../domain/models/track.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit {

  album$!: Observable<Album>

  constructor(
    private _spotifyRepository: SpotifyRepository,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const albumId = params['id'] || '4aawyAB9vmqN3uQ7FjRGTy'; // Default ID if none provided
      // console.log('ID de Álbum cargado:', albumId);
      this.album$ = this._spotifyRepository.getAlbum(albumId);
    });
  }

}
