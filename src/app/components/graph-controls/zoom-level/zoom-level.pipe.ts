import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zoomLevel',
})
export class ZoomLevelPipe implements PipeTransform {
  transform(zoom: number): string {
    return `${zoom}%`;
  }
}
