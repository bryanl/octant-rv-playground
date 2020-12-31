export interface Node {
  id: string;
  name: string;
  group?: string;
  version: string;
  kind: string;
  parent?: string;
  extra?: { [key: string]: any };
  targets?: string[];
  keywords?: string[];
}
