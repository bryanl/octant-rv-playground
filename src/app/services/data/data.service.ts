import { Injectable } from '@angular/core';
import { EdgeDefinition, NodeDefinition } from 'cytoscape';
import { GraphData } from '../../modules/cytoscape/cytoscape-graph/graph_data';

export interface Node {
  id: string;
  name: string;
  group?: string;
  version: string;
  kind: string;
  parent?: string;
  extra?: { [key: string]: any };
  targets?: string[];
}

const nodes1: Node[] = [
  {
    id: 'deployment-nginx',
    name: 'nginx',
    group: 'apps',
    version: 'v1',
    kind: 'Deployment',
  },
  {
    id: 'deployment-nginx-77bd6fc7d8',
    name: '77bd6fc7d8',
    group: 'apps',
    version: 'v1',
    kind: 'ReplicaSet',
    parent: 'deployment-nginx',
    extra: {
      podsOk: 10,
    },
    targets: ['serviceaccount-default', 'secret-default-token-1'],
  },
  {
    id: 'deployment-nginx-9d6658964',
    name: '9d6658964',
    group: 'apps',
    version: 'v1',
    kind: 'ReplicaSet',
    parent: 'deployment-nginx',
    extra: {
      podsOk: 3,
      podsWarning: 8,
      podsError: 2,
      status: 'error',
    },
    targets: ['serviceaccount-default', 'secret-default-token-1'],
  },
  {
    id: 'serviceaccount-default',
    name: 'default',
    version: 'v1',
    kind: 'ServiceAccount',
  },
  {
    id: 'secret-default-token-1',
    name: 'default-token-1',
    version: 'v1',
    kind: 'Secret',
  },
  {
    id: 'service-service',
    name: 'service',
    version: 'v1',
    kind: 'Service',
    targets: ['deployment-nginx-77bd6fc7d8', 'deployment-nginx-9d6658964'],
  },
];

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  graphData(): GraphData {
    const generator = new BOMGenerator(nodes1);
    const gen = generator.generate();

    return {
      nodes: gen.nodes,
      edges: gen.edges,
    };
  }
}

class BOMGenerator {
  constructor(private nodes: Node[]) {}

  generate(): GraphData {
    return {
      nodes: this.nodeDefinitions(),
      edges: this.edgeDefinitions(),
    };
  }

  private nodeDefinitions(): NodeDefinition[] {
    return this.nodes.map(node => {
      const apiVersion = node.group
        ? `${node.group}/${node.version}`
        : node.version;
      const classes = node.group ? `${node.group}-${node.kind}` : node.kind;
      const description = `${apiVersion} ${node.kind}`;

      return {
        data: {
          id: node.id,
          parent: node.parent,
          label: node.name,
          description,
          apiVersion,
          kind: node.kind,
          width: description.length * 6,
          ...node.extra,
        },
        classes,
      };
    });
  }

  private edgeDefinitions(): EdgeDefinition[] {
    return this.nodes
      .filter(node => (node.targets ? node.targets.length > 0 : false))
      .reduce<EdgeDefinition[]>((prev, cur) => {
        return [
          ...cur.targets.map<EdgeDefinition>(target => {
            return {
              data: {
                id: `${cur.id}-${target}`,
                source: cur.id,
                target,
              },
              selectable: false,
            };
          }),
          ...prev,
        ];
      }, []);
  }
}
