import {Component, inject, OnInit} from '@angular/core';
import {TopAnimeComponent} from '../../../features/anime/components/top-anime/top-anime.component';
import {
  RecommendedAnimeComponent
} from '../../../features/anime/components/recomended-anime/recommended-anime.component';
import {MetadataService} from '../../../shared/services/metadata.service';

@Component({
  selector: 'app-home',
  imports: [
    TopAnimeComponent,
    RecommendedAnimeComponent
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  metadataService = inject(MetadataService)

  ngOnInit() {
    this.metadataService.updateMetadata({
      title: "Find your favourite anime here, Best and Recommended releases"
    })
  }
}
