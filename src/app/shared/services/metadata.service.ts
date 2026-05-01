import {inject, Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

export interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  private title = inject(Title)
  private meta = inject(Meta)

  private readonly websiteName = "AniDream"
  private readonly defaultDescription = "AniDream is a platform that allows you to search for anime."
  private readonly defaultImage = "/logo.webp"

  updateMetadata(data: Metadata) {
    this.title.setTitle(data.title ? `${data.title} | ${this.websiteName}` : this.websiteName);
    this.meta.updateTag({ name: 'description', content: data.description || this.defaultDescription });
    this.meta.updateTag({ property: 'og:description', content: data.description || this.defaultDescription  });
    this.meta.updateTag({ property: 'og:image', content: data.image || this.defaultImage });
    if (data.url) {
      this.meta.updateTag({ property: 'og:url', content: data.url });
    }
    this.meta.updateTag({ property: 'og:title', content: data.title || this.websiteName });
  }
}
