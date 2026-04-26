export interface WebpImage {
  image_url: string | null;
  small_image_url: string | null;
  large_image_url: string | null;
}

export interface JpgImage {
  image_url: string | null;
  small_image_url: string | null;
  large_image_url: string | null;
}

export interface Images {
  webp: WebpImage;
  jpg: JpgImage;
}
