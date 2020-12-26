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

const nodeList: Node[] = [
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

  // knative
  {
    id: 'serving.knative.dev/v1-Service-helloworld-go',
    name: 'helloworld-go',
    group: 'serving.knative.dev',
    version: 'v1',
    kind: 'Service',
  },
  {
    id: 'serving.knative.dev/v1-Configuration-helloworld-go',
    name: 'helloworld-go',
    group: 'serving.knative.dev',
    version: 'v1',
    kind: 'Configuration',
    targets: ['serving.knative.dev/v1-Service-helloworld-go'],
  },
  {
    id: 'serving.knative.dev/v1-Revision-helloworld-go-yhclv-1',
    name: 'helloworld-g-yhclv-1',
    group: 'serving.knative.dev',
    version: 'v1',
    kind: 'Revision',
    targets: ['serving.knative.dev/v1-Configuration-helloworld-go'],
  },
  {
    id:
      'autoscaling.internal.knative.dev/v1alpha1-PodAutoscaler-helloworld-go-yhclv-1',
    name: 'helloworld-go-yhclv-1',
    group: 'autoscaling.internal.knative.dev',
    version: 'v1alpha1',
    kind: 'PodAutoscaler',
    targets: ['serving.knative.dev/v1-Revision-helloworld-go-yhclv-1'],
  },
  {
    id:
      'networking.internal.knative.dev/v1alpha1-ServerlessService-helloworld-go-yhclv-1',
    name: 'helloworld-go-yhclv-1',
    group: 'networking.internal.knative.dev',
    version: 'v1alpha1',
    kind: 'ServerlessService',
    targets: [
      'autoscaling.internal.knative.dev/v1alpha1-PodAutoscaler-helloworld-go-yhclv-1',
    ],
  },
  {
    id: 'v1-Service-helloworld-go-yhclv-1-private',
    name: 'helloworld-go-yhclv-1-private',
    version: 'v1',
    kind: 'Service',
    targets: [
      'networking.internal.knative.dev/v1alpha1-ServerlessService-helloworld-go-yhclv-1',
      'apps/v1-ReplicaSet-nginx-77bd6fc7d8',
    ],
  },
  {
    id: 'apps/v1-Deployment-helloworld-go-yhclv-1-deployment',
    name: 'helloworld-go-yhclv-1-deployment',
    group: 'apps',
    version: 'v1',
    kind: 'Deployment',
    targets: ['serving.knative.dev/v1-Revision-helloworld-go-yhclv-1'],
  },
  {
    id: 'apps/v1-ReplicaSet-nginx-77bd6fc7d8',
    name: '77bd6fc7d8',
    group: 'apps',
    version: 'v1',
    kind: 'ReplicaSet',
    parent: 'apps/v1-Deployment-helloworld-go-yhclv-1-deployment',
    extra: {
      podsOk: 1,
    },
    targets: ['serviceaccount-default', 'secret-default-token-1'],
  },

  // daemon set
  {
    id: 'apps/v1-DaemonSet-fluentd',
    name: 'fluentd',
    group: 'apps',
    version: 'v1',
    kind: 'DaemonSet',
  },
  {
    id: 'v1-Pod-fluentd',
    name: 'fluentd',
    version: 'v1',
    kind: 'Pod',
    parent: 'apps/v1-DaemonSet-fluentd',
    targets: ['serviceaccount-default', 'secret-default-token-1'],
  },
];

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  graphData(): GraphData {
    const generator = new BOMGenerator(nodeList);
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
