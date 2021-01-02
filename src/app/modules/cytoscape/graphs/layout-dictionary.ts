import {
  BaseLayoutOptions,
  BreadthFirstLayoutOptions,
  CircleLayoutOptions,
  ConcentricLayoutOptions,
  CoseLayoutOptions,
  GridLayoutOptions,
  LayoutOptions,
  NullLayoutOptions,
  PresetLayoutOptions,
  RandomLayoutOptions,
} from 'cytoscape';
import { Layout } from '../types/graph';
import { CoseBilkentGraph } from './cose-bilkent';
import { DagreGraph, DagreGraphOptions } from './dagre-graph';

export type Options =
  | DagreGraphOptions
  | CoseBilkentGraph
  | NullLayoutOptions
  | RandomLayoutOptions
  | PresetLayoutOptions
  | GridLayoutOptions
  | CircleLayoutOptions
  | ConcentricLayoutOptions
  | BreadthFirstLayoutOptions
  | CoseLayoutOptions
  | BaseLayoutOptions;

export const LayoutMap = {
  'cose-bilkent': CoseBilkentGraph.getLayout(),
  dagre: DagreGraph.getLayout(),
};

export const getLayout = (layout: LayoutOptions): LayoutOptions =>
  LayoutMap.hasOwnProperty(layout.name) ? LayoutMap[layout.name] : LayoutMap.dagre;

export const getLayoutByName = (layoutName: string): LayoutOptions =>
  LayoutMap.hasOwnProperty(layoutName) ? LayoutMap[layoutName] : LayoutMap.dagre;
