import { EdgeDefinition, ElementsDefinition, NodeDefinition } from 'cytoscape';
import { GraphNodeData } from '../../modules/cytoscape/types/graph';

export class BOMGenerator {
  constructor(private nodes: GraphNodeData[]) {}

  generate(): ElementsDefinition {
    return {
      nodes: this.nodeDefinitions(),
      edges: this.edgeDefinitions(),
    };
  }

  private nodeDefinitions(): NodeDefinition[] {
    return this.nodes.map(node => {
      return {
        data: {
          ...node,
        },
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
