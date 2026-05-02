import {Component, inject, OnInit, signal, computed, Input} from '@angular/core';
import { AnimeService } from '../../services/anime.service';
import {IAnime, AnimeListSortByValues} from '../../_schemas/anime.schema';
import {RouterLink} from '@angular/router';
import {AnimeCardComponent} from '../anime-card/anime-card.component';

const LIMIT = 14;

@Component({
  selector: 'app-top-anime',
  imports: [
    RouterLink,
    AnimeCardComponent
  ],
  templateUrl: './top-anime.component.html',
})
export class TopAnimeComponent implements OnInit {
  animeService = inject(AnimeService);

  @Input() limit = LIMIT;

  loadedTopAnime = signal<IAnime[] | null>(null);
  isLoading = signal(true);

  displayed = computed(() => {
    const list = this.loadedTopAnime();
    if (!list) return [];
    return list.slice(0, this.limit);
  });

  ngOnInit() {
    this.animeService.listAnime({perPage: this.limit, page: 1, sortColumn: AnimeListSortByValues.Score, sortDirection: 'desc'}).subscribe({
      next: (res) => {
        this.loadedTopAnime.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
