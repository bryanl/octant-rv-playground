import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OldGraphData } from '../../modules/cytoscape/cytoscape-graph/graph_data';
import { WebSocketService } from '../web-socket/web-socket.service';
import { BOMGenerator } from './bom-generator';
import { Node } from './node';

interface NodeResponse {
  nodes: Node[];
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private graphDataSubject: BehaviorSubject<OldGraphData> = new BehaviorSubject<OldGraphData>({});

  constructor(private http: HttpClient, private webSocketService: WebSocketService) {
    this.webSocketService.registerHandler('nodes', this.handleGraphData.bind(this));
    this.webSocketService.open();
    this.webSocketService.sendMessage('workloads', {
      namespace: 'default',
    });
  }

  private handleGraphData(data: { [key: string]: any }): void {
    const nodeData = data as NodeResponse;

    const generator = new BOMGenerator(nodeData.nodes);
    if (this.graphDataSubject) {
      this.graphDataSubject.next(generator.generate());
    }
  }

  graphData(): Observable<OldGraphData> {
    return this.graphDataSubject;
  }

  get(): Observable<NodeResponse> {
    return this.http.get<NodeResponse>('http://localhost:8181/v1/nodes');
  }
}
