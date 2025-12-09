import { Component, OnInit } from '@angular/core';
import { SpotifyLoginService } from './services/spotify-api/spotify-login-service';
import { CookiesStorageService } from './services/general/cookies-storage-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {

  constructor(
    private _spotifyLogin: SpotifyLoginService,
    private _cookieStorage: CookiesStorageService
  ) { }

  ngOnInit(): void {
    this._cookieStorage.deleteKeyValue('access_token');
    this._spotifyLogin.getAccessToken().subscribe({
      next: (response) => {
        console.log('Token recibido de Spotify');
        this._cookieStorage.setKey('access_token', response.access_token, new Date(new Date().getTime() + 3600 * 1000));
      },
      error: () => {
      }
    });
  }

}
