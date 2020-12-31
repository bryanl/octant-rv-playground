import { DecoratedGraphElements } from './graph';
import { FetchParams } from './graph-data-source';

export type GraphData = {
  elements: DecoratedGraphElements;
  fetchParams: FetchParams;
};
