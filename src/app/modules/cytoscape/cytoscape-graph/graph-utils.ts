import * as Cy from 'cytoscape';
import * as LayoutDictionary from '../graphs/layout-dictionary';
import { CyNode } from '../types/cy-node';
import {
  CytoscapeBaseEvent,
  CytoscapeGlobalScratchNamespace,
  DecoratedGraphEdgeData,
  DecoratedGraphNodeData,
  Layout,
} from '../types/graph';
import { angleBetweenVectors, normalize, squaredDistance } from '../utils/math';

export const ZoomOptions = {
  fitPadding: 25,
  maxZoom: 2.5,
};

export const safeFit = (cy: Cy.Core, centerElements?: Cy.Collection) => {
  cy.fit(centerElements, ZoomOptions.fitPadding);
  if (cy.zoom() > ZoomOptions.maxZoom) {
    cy.zoom(ZoomOptions.maxZoom);
    !!centerElements && !!centerElements.length ? cy.center(centerElements) : cy.center();
  }

  cy.emit('fit');
};

export const runLayout = (cy: Cy.Core, layout: Layout) => {
  const showNodeLabels = cy.scratch(CytoscapeGlobalScratchNamespace).showNodeLabels;

  (cy as any).nodeHtmlLabel().updateNodeLabel(cy.nodes());

  const layoutOptions = LayoutDictionary.getLayout(layout);
  // NOTE: compound layout
  // if (cy.nodes('$node > node').length > 0) {
  //   // if there is a compound node, run the compound layout
  //   cy.layout({
  //     ...layoutOptions,
  //     name: 'group-compound-layout',
  //     compoundLayoutOptions: LayoutDictionary.getLayout(DagreGraph.getLayout()),
  //   }).run();
  // } else {
  //   cy.layout(layoutOptions).run();
  // }

  // NOTE: single layout
  cy.layout(layoutOptions).run();
  cy.scratch(CytoscapeGlobalScratchNamespace).showNodeLabels = showNodeLabels;
};

export const isNode = (target: Cy.NodeSingular | Cy.EdgeSingular | Cy.Core): target is Cy.NodeSingular => {
  return !isCore(target) && target.isNode();
};

export const isEdge = (target: Cy.NodeSingular | Cy.EdgeSingular | Cy.Core): target is Cy.NodeSingular => {
  return !isCore(target) && target.isEdge();
};

export const isCore = (target: Cy.NodeSingular | Cy.EdgeSingular | Cy.Core): target is Cy.Core => {
  return !('cy' in target);
};

// Expands the bounds of a node, taking into consideration the labels. This is important not only
// for displaying the label, but to avoid nodes overlapping with other labels.
// We assume that a label is placed centered in the bottom part of a node.
// The algorithm is:
// - Take the old bounds-expansion
// - Get the bounding-box of a node (without taking into account the overlays  i.e. the one that appears on click)
// - Compute the required extra width as the label width minus the bounding box width
//   - This will yield a a positive number if we need more space, or negative if we need less space.
// - Compute the required height as the height of the label. Since the label is at the bottom, we only need that.
//   If its center was aligned with the center of the node, we would do a similar operation as with the width.
// - Spread the required width as extra space in the left area and space in the right area of the cy node
//   (half in each side)
// - Required height is only needed at the bottom, so we now that we always have to grow at the bottom by this value.
export const expandNodeBounds = (target: Cy.NodeSingular, node: any) => {
  let oldBE = target.numericStyle('bounds-expansion');
  if (oldBE.length === 1) {
    oldBE = Array(4).fill(oldBE[0]);
  }
  // Do not include the "click" overlay on the bounding box calc
  const bb = target.boundingBox({ includeOverlays: false });
  let newBE = [...oldBE];
  const requiredWidth = node.offsetWidth - bb.w;
  const requiredHeight = node.offsetHeight;
  newBE[1] += requiredWidth * 0.5;
  newBE[3] += requiredWidth * 0.5;
  newBE[2] = requiredHeight;

  // Ensure we don't end with negative values in our bounds-expansion
  newBE = newBE.map(val => Math.max(val, 0));

  const compareBoundsExpansion = (be1: number[], be2: number[]) => {
    if (be1.length !== be2.length) {
      return false;
    }

    const delta = 0.00001;

    for (let i = 0; i < be1.length; ++i) {
      if (Math.abs(be1[i] - be2[i]) > delta) {
        return false;
      }
    }
    return true;
  };

  // Only trigger an update if it really changed, else just skip to avoid this function to call again
  if (!compareBoundsExpansion(oldBE, newBE)) {
    target.style('bounds-expansion', newBE);
    // bounds-expansion changed. Make sure we tell our parent (if any) to update as well (so he can update the label position).
    if (target.isChild()) {
      // The timeout ensures that the previous value is already applied
      setTimeout(() => {
        if (!target.cy().destroyed()) {
          (target.cy() as any) // because we are using an extension
            .nodeHtmlLabel()
            .updateNodeLabel(target.parent());
        }
      }, 0);
    }
  }
};

export const fixLoopOverlap = (cy: Cy.Core) => {
  cy.$(':loop').forEach(loop => {
    const node = loop.source();
    const otherEdges = node.connectedEdges().subtract(loop);
    const minDistance = 1;

    // Default values in rads (taken from cytoscape docs)
    const DEFAULT_LOOP_SWEEP = -1.5707;
    const DEFAULT_LOOP_DIRECTION = -0.7854;

    loop.style('loop-direction', DEFAULT_LOOP_DIRECTION);
    loop.style('loop-sweep', DEFAULT_LOOP_SWEEP);

    let found = false;
    // Check if we have any other edge that overlaps with any of our loop edges
    // this uses cytoscape forEach (https://js.cytoscape.org/#eles.forEach)
    otherEdges.forEach(edge => {
      const testPoint = edge.source().same(node) ? edge.sourceEndpoint() : edge.targetEndpoint();
      if (
        squaredDistance(testPoint, loop.sourceEndpoint()) <= minDistance ||
        squaredDistance(testPoint, loop.targetEndpoint()) <= minDistance
      ) {
        found = true;
        return false; // break the inner cytoscape forEach
      }
      return; // return to avoid typescript error about "not all code paths return a value"
    });

    if (!found) {
      return;
    }

    // Simple case, one other edge, just move the loop-direction half the default loop-sweep value to avoid the edge
    if (otherEdges.length === 1) {
      const loopDirection = loop.numericStyle('loop-direction') - loop.numericStyle('loop-sweep') * 0.5;
      loop.style('loop-direction', loopDirection);
      return;
    }

    // Compute every angle between the top (12 o’clock position)
    // We store the angles as radians and positive numbers, thus we add PI to the negative angles.
    const usedAngles: number[] = [];
    otherEdges.forEach(edge => {
      const testPoint = edge.source().same(node) ? edge.sourceEndpoint() : edge.targetEndpoint();
      const angle = angleBetweenVectors(
        normalize({ x: testPoint.x - node.position().x, y: testPoint.y - node.position().y }),
        { x: 0, y: 1 }
      );
      usedAngles.push(angle < 0 ? angle + 2 * Math.PI : angle);
    });

    usedAngles.sort((a, b) => a - b);

    // Try to fit our loop in the longest arc
    // Iterate over the found angles and find the longest distance
    const maxArc = {
      start: 0,
      end: 0,
      value: 0,
    };
    for (let i = 0; i < usedAngles.length; ++i) {
      const start = i === 0 ? usedAngles[usedAngles.length - 1] : usedAngles[i - 1];
      const end = usedAngles[i];
      const arc = Math.abs(start - end);
      if (arc > maxArc.value) {
        maxArc.value = arc;
        maxArc.start = start;
        maxArc.end = end;
      }
    }

    // If the max arc is 1.0 radians (the biggest gap is of about 50 deg), the node is already too busy, ignore it
    if (maxArc.value < 1.0) {
      return;
    }

    if (maxArc.start > maxArc.end) {
      // To ensure the difference between end and start goes in the way we want, we add a full circle to our end
      maxArc.end += Math.PI * 2;
    }

    if (maxArc.value <= -DEFAULT_LOOP_SWEEP) {
      // Make it slightly smaller to be able to fit
      // loop-sweep is related to the distance between the start and end of our loop edge
      loop.style('loop-sweep', -maxArc.value * 0.9);
      maxArc.start += maxArc.value * 0.05;
      maxArc.end -= maxArc.value * 0.05;
    }
    // Move the loop to the center of the arc, loop-direction is related to the middle point of the loop
    loop.style('loop-direction', maxArc.start + (maxArc.end - maxArc.start) * 0.5);
  });
};

export const getCytoscapeBaseEvent = (cy: Cy.Core, event: Cy.EventObject): CytoscapeBaseEvent | null => {
  const summaryTarget = event.target;
  if (summaryTarget === cy) {
    return { summaryType: 'graph', summaryTarget: cy };
  } else if (isNode(summaryTarget)) {
    const summaryType = summaryTarget.data(CyNode.isGroup) ? 'group' : 'node';
    return { summaryType, summaryTarget };
  } else if (isEdge(summaryTarget)) {
    return { summaryType: 'edge', summaryTarget };
  } else {
    return null;
  }
};

export const decoratedEdgeData = (ele: Cy.EdgeSingular): DecoratedGraphEdgeData => {
  return ele.data();
};
export const decoratedNodeData = (ele: Cy.NodeSingular): DecoratedGraphNodeData => {
  return ele.data();
};
