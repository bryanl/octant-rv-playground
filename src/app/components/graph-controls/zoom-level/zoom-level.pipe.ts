import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zoomLevel',
})
export class ZoomLevelPipe implements PipeTransform {
  transform(zoom: number): string {
    if (isNaN(zoom)) {
      return '100%';
    }

    const translated = zoom * 100;
    return `${Math.round(translated)}%`;
  }
}
