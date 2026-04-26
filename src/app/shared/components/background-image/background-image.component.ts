import { Component } from '@angular/core';

@Component({
  selector: 'app-background-image',
  imports: [],
  template: `
    <div class="sticky! top-0 -z-10 h-0 overflow-visible">
      <div class="w-full h-screen bg-[url('/bg.png')] bg-cover blur-lg opacity-40"></div>
    </div>
  `
})
export class BackgroundImageComponent {}
