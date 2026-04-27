import {Component, inject, OnInit} from '@angular/core';
import {AnimeService} from '../../services/anime.service';
import {Router} from '@angular/router';
import {animeRoute} from '../../../../shared/utils/paths';

@Component({
  selector: 'app-random-anime',
  imports: [],
  templateUrl: './random-anime.component.html',
})
export class RandomAnimeComponent implements OnInit {
  animeService = inject(AnimeService);
  router = inject(Router);

  ngOnInit() {
    this.animeService.getRandomAnime().subscribe({
      next: (res) => {
        this.router.navigate([animeRoute, res.data.mal_id ])
      },
    });
  }
}
