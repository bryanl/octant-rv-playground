import { Layout } from '../types/graph';
import { CoseBilkentGraph } from './cose-bilkent';
import { DagreGraph } from './dagre-graph';

export const LayoutMap = {
  'cose-bilkent': CoseBilkentGraph.getLayout(),
  dagre: DagreGraph.getLayout(),
};

export const getLayout = (layout: Layout) =>
  LayoutMap.hasOwnProperty(layout.name) ? LayoutMap[layout.name] : LayoutMap.dagre;

export const getLayoutByName = (layoutName: string) =>
  LayoutMap.hasOwnProperty(layoutName) ? LayoutMap[layoutName] : LayoutMap.dagre;
