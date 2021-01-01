import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as Cy from 'cytoscape';
import cytoscape, { Core, EdgeSingular, NodeSingular, Position, SelectionType } from 'cytoscape';
import { GraphHighlighter } from '../graphs/graph-highlighter';
import { CyNode } from '../types/cy-node';
import {
  CytoscapeBaseEvent,
  CytoscapeClickEvent,
  CytoscapeGlobalScratchData,
  CytoscapeGlobalScratchNamespace,
  CytoscapeMouseInEvent,
  CytoscapeMouseOutEvent,
} from '../types/graph';
import { GraphData } from '../types/graph-data';
import FocusAnimation from './focus-animation';
import * as graphUtils from './graph-utils';
import { GraphConfig } from './graph_config';
import { WrapperComponent } from './wrapper/wrapper.component';

export interface GraphState {
  zoom?: number;
}

@Component({
  selector: 'app-cytoscape-graph',
  template: `<app-wrapper #wrapper></app-wrapper>`,
  styleUrls: ['./cytoscape-graph.component.scss'],
})
export class CytoscapeGraphComponent implements OnChanges, AfterViewInit {
  static doubleTapMs = 350;

  @ViewChild('wrapper')
  wrapper: WrapperComponent;

  // TODO remove - old
  @Input()
  pan: Position;

  // TODO remove - old
  @Input()
  selectionType: SelectionType;

  // TODO Remove - old
  @Input()
  config: GraphConfig;

  // TODO remove - old
  @Input()
  zoom = 1;

  @Input()
  graphData: GraphData;

  @Input()
  focusSelector?: string;

  @Output()
  state: EventEmitter<GraphState> = new EventEmitter<GraphState>();

  @Output()
  selected: EventEmitter<NodeSingular> = new EventEmitter<cytoscape.NodeSingular>();

  @Output()
  updateSummary: EventEmitter<CytoscapeClickEvent> = new EventEmitter<CytoscapeClickEvent>();

  @Output()
  ready: EventEmitter<Cy.Core> = new EventEmitter<cytoscape.Core>();

  @Output()
  doubleTap: EventEmitter<CytoscapeBaseEvent> = new EventEmitter<CytoscapeBaseEvent>();

  loading = false;

  private customViewport: boolean;
  private tapTarget: any;
  private tapTimeout: any;
  private graphHighlighter?: GraphHighlighter;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const cy = this.getCy();
    if (!cy) {
      return;
    }

    let updateLayout = false;

    const graphData = changes.graphData;
    if (this.elementsNeedRelayout(graphData.previousValue.elements, graphData.currentValue.elements)) {
      updateLayout = true;
    }

    this.processGraphUpdate(cy, updateLayout);
  }

  getCy(): null | cytoscape.Core {
    if (this.wrapper) {
      return this.wrapper.getCy();
    }

    return null;
  }

  ngAfterViewInit(): void {
    this.cyInitialization(this.getCy());
  }

  zoomIn(): void {
    this.getCy().zoom(this.zoom + 0.01);
  }

  zoomOut(): void {
    this.getCy().zoom(this.zoom - 0.01);
  }

  maximize(): void {
    this.getCy().fit();
  }

  private cyInitialization(cy: Cy.Core): void {
    if (!cy) {
      return;
    }

    this.graphHighlighter = new GraphHighlighter(cy);

    const getCytoscapeBaseEvent = (event: Cy.EventObject): CytoscapeBaseEvent | null => {
      const target = event.target;
      if (target === cy) {
        return { summaryType: 'graph', summaryTarget: cy };
      } else if (graphUtils.isNode(target)) {
        if (target.data(CyNode.isGroup)) {
          return { summaryType: 'group', summaryTarget: target };
        } else {
          return { summaryType: 'node', summaryTarget: target };
        }
      } else if (graphUtils.isEdge(target)) {
        return { summaryType: 'edge', summaryTarget: target };
      } else {
        return null;
      }
    };

    const findRelatedNode = (element: Element): string | null => {
      if (element.getAttribute('data-node-id')) {
        return null;
      }

      while (element && element.getAttribute) {
        const dataNodeId = element.getAttribute('data-node-id');
        if (dataNodeId) {
          return dataNodeId;
        }
        element = element.parentNode as Element;
      }

      return null;
    };

    cy.on('tap', (event: Cy.EventObject) => {
      if (event.originalEvent) {
        const element = document.elementFromPoint(event.originalEvent.clientX, event.originalEvent.clientY);
        const realTargetId = findRelatedNode(element);
        if (realTargetId) {
          const realTarget = cy.$id(realTargetId);
          if (realTarget) {
            event.preventDefault();
            realTarget.trigger('tap');
            return;
          }
        }
      }

      let tapped: NodeSingular | EdgeSingular | Core | null = event.target;
      if (this.tapTimeout) {
        // cancel any single-tap timer in progress
        clearTimeout(this.tapTimeout);
        this.tapTimeout = null;

        if (tapped === this.tapTarget) {
          // if we click the same target again, perform double-tap
          tapped = null;
          this.tapTarget = null;
          const cytoscapeEvent = getCytoscapeBaseEvent(event);
          if (cytoscapeEvent) {
            this.handleDoubleTap(cytoscapeEvent);
          }
        }
      }

      if (tapped) {
        // start single-tap timer
        this.tapTarget = tapped;
        this.tapTimeout = setTimeout(() => {
          // timer expired without a follow-up click, so perform single-tap
          this.tapTarget = null;
          const cytoscapeEvent = getCytoscapeBaseEvent(event);
          if (cytoscapeEvent) {
            this.handleTap(cytoscapeEvent);
            this.selectTarget(event.target, true);
          }
        }, CytoscapeGraphComponent.doubleTapMs);
      }
    });

    cy.on('mouseover', 'node,edge', (evt: Cy.EventObject) => {
      const cytoscapeEvent = getCytoscapeBaseEvent(evt);
      if (cytoscapeEvent) {
        this.handleMouseIn(cytoscapeEvent);
      }
    });

    cy.on('mouseout', 'node,edge', (evt: Cy.EventObject) => {
      const cytoscapeEvent = getCytoscapeBaseEvent(evt);
      if (cytoscapeEvent) {
        this.handleMouseOut(cytoscapeEvent);
      }
    });

    cy.on('viewport', (event: Cy.EventObject) => {
      const cytoscapeEvent = getCytoscapeBaseEvent(event);
      if (cytoscapeEvent) {
        this.customViewport = false;
      }
    });

    cy.on('fit', (event: Cy.EventObject): void => {
      const cytoscapeEvent = graphUtils.getCytoscapeBaseEvent(cy, event);
      if (cytoscapeEvent) {
        this.customViewport = false;
      }
    });

    cy.on('nodehtml-create-or-update', 'node', (event: Cy.EventObjectNode, data: any): void => {
      const { label, isNew } = data;
      const { target } = event;
      const node = label.getNode();

      if (isNew) {
        node.setAttribute('data-node-id', target.id());
      }

      if (target.isParent) {
        return;
      }

      graphUtils.expandNodeBounds(target, node);
    });

    cy.on('layoutstop', (_: Cy.EventObject) => {
      this.safeFit(cy);
      graphUtils.fixLoopOverlap(cy);
    });

    cy.ready((event: Cy.EventObject) => {
      this.ready.emit(event.cy);
      this.processGraphUpdate(cy, true);
    });

    cy.on('destroy', (_: Cy.EventObject) => {
      this.wrapper.destroy();
      this.updateSummary.emit({ summaryType: 'graph', summaryTarget: undefined });
    });
  }

  private processGraphUpdate(cy: Cy.Core, updateLayout: boolean): void {
    if (!this.graphData) {
      return;
    }

    const globalScratchData: CytoscapeGlobalScratchData = {
      graphType: this.graphData.fetchParams.graphType,
      showNodeLabels: true, // TODO: is this right?
    };
    cy.scratch(CytoscapeGlobalScratchNamespace, globalScratchData);

    cy.startBatch();

    if (updateLayout) {
      cy.nodes().positions({ x: 0, y: 0 });
    }

    cy.json({ elements: this.graphData.elements });

    cy.endBatch();

    if (updateLayout) {
      graphUtils.runLayout(cy, this.config.layoutOptions);
    }

    cy.nodes().unselectify();
    cy.edges().unselectify();

    if (cy.$(':selected').length === 0) {
      this.handleTap({ summaryType: 'graph', summaryTarget: cy });
    }
  }

  private handleTap(event: CytoscapeClickEvent): void {
    this.updateSummary.emit(event);
  }

  private elementsNeedRelayout(prevElements: any, nextElements: any): boolean {
    if (prevElements === nextElements) {
      return false;
    }

    if (
      !prevElements ||
      !nextElements ||
      !prevElements.nodes ||
      !prevElements.edges ||
      !nextElements.nodes ||
      !nextElements.edges ||
      prevElements.nodes.length !== nextElements.nodes.length ||
      prevElements.edges.length !== nextElements.edges.length
    ) {
      return true;
    }

    return !(
      this.nodeOrEdgeArrayHasSameIds(nextElements.nodes, prevElements.nodes) &&
      this.nodeOrEdgeArrayHasSameIds(nextElements.edges, prevElements.edges)
    );
  }

  private nodeOrEdgeArrayHasSameIds<T extends Cy.NodeSingular | Cy.EdgeSingular>(a: Array<T>, b: Array<T>): boolean {
    const aIds = a.map(e => e.id).sort();
    return b
      .map(e => e.id)
      .sort()
      .every((eId, index) => eId === aIds[index]);
  }

  private handleDoubleTap(event: CytoscapeBaseEvent): void {
    this.doubleTap.emit(event);
  }

  private selectTarget(target?: Cy.NodeSingular | Cy.EdgeSingular | Cy.Core, isTapped: boolean = false): void {
    // TODO: make a mini graph
    // if (this.props.isMiniGraph && isTapped) {
    //   return;
    // }
    const cy = this.getCy();
    if (cy) {
      cy.$(':selected').selectify().unselect().unselectify();
      if (target && !graphUtils.isCore(target)) {
        target.selectify().select().unselectify();
      }
    }
  }

  private selectTargetAndUpdateSummary(target: Cy.NodeSingular | Cy.EdgeSingular): void {
    this.selectTarget(target);
    const event: CytoscapeClickEvent = {
      summaryType: target.data(CyNode.isGroup) ? 'group' : 'node',
      summaryTarget: target,
    };

    this.updateSummary.emit(event);

    if (this.graphHighlighter) {
      this.graphHighlighter.onClick(event);
    }
  }

  private handleMouseIn(event: CytoscapeMouseInEvent): void {
    if (this.graphHighlighter) {
      this.graphHighlighter.onMouseIn(event);
    }
  }

  private handleMouseOut(event: CytoscapeMouseOutEvent): void {
    if (this.graphHighlighter) {
      this.graphHighlighter.onMouseOut(event);
    }
  }

  private safeFit(cy: Cy.Core, force?: boolean): void {
    if (!force && this.customViewport) {
      return;
    }
    this.focus(cy);
    graphUtils.safeFit(cy);
  }

  private focus(cy: Cy.Core): void {
    if (!this.focusSelector) {
      return;
    }

    let selected = cy.$(this.focusSelector);

    // only perform the focus one time
    this.focusSelector = undefined;

    if (!selected) {
      return;
    }

    // If there is only one, select it
    if (selected.length === 1) {
      this.selectTargetAndUpdateSummary(selected[0]);
    } else {
      // If we have many elements, try to check if a compound in this query contains everything, if so, select it.
      const compound = selected.filter('$node > node');
      if (compound && compound.length === 1 && selected.subtract(compound).same(compound.children())) {
        this.selectTargetAndUpdateSummary(compound[0]);
        selected = compound;
      }
    }

    // Start animation
    new FocusAnimation(cy).start(selected);
  }
}
