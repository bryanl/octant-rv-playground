import { EdgeDefinition, NodeDefinition } from 'cytoscape';
import { OldGraphData } from '../../modules/cytoscape/cytoscape-graph/graph_data';
import { Node } from './node';

export class BOMGenerator {
  constructor(private nodes: Node[]) {}

  generate(): OldGraphData {
    return {
      nodes: this.nodeDefinitions(),
      edges: this.edgeDefinitions(),
    };
  }

  private nodeDefinitions(): NodeDefinition[] {
    return this.nodes.map(node => {
      const keywords = [node.group ? `${node.group}-${node.kind}` : node.kind];
      if (node.keywords) {
        keywords.push(...node.keywords);
      }

      const apiVersion = node.group ? `${node.group}/${node.version}` : node.version;
      const classes = keywords.join(' ');
      const description = `${apiVersion} ${node.kind}`;

      return {
        data: {
          id: node.id,
          parent: node.parent,
          label: node.name,
          description,
          apiVersion,
          nodeType: node.nodeType,
          kind: node.kind,
          width: description.length * 6,
          ...node.extra,
          isGroup: node.isGroup,
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
