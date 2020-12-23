import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slidingSidebarToggleLabel',
})
export class SlidingSidebarToggleLabelPipe implements PipeTransform {
  transform(isClosed: boolean): string {
    return isClosed ? 'Show' : 'Hide';
  }
}
