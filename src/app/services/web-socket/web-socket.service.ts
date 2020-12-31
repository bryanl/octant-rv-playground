import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export interface WebSocketPayload {
  type: string;
  data?: { [key: string]: any };
}

export type Handler = (data: { [key: string]: any }) => void;

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private opened = false;
  private subject: WebSocketSubject<WebSocketPayload>;
  private handlers: { [key: string]: Handler } = {};

  constructor() {}

  static uri(): string {
    return 'ws://localhost:8181/v1/ws';
  }

  registerHandler(name: string, handler: Handler): () => void {
    this.handlers[name] = handler;
    return () => {
      delete this.handlers[name];
    };
  }

  open(): void {
    if (this.opened) {
      return;
    }

    this.createWebSocket().subscribe(
      message => {
        this.parseWebSocketMessage(message);
      },
      error => console.error(error),
      () => console.log('web socket is closing')
    );
  }

  sendMessage(messageType: string, payload: {}): void {
    if (this.subject) {
      const data = {
        type: messageType,
        payload,
      };
      this.subject.next(data);
    }
  }

  private createWebSocket(): Observable<WebSocketPayload> {
    const uri = WebSocketService.uri();
    return new Observable(observer => {
      try {
        const subject = webSocket<WebSocketPayload>({
          url: uri,
        });

        const subscription = subject.asObservable().subscribe(
          message => observer.next(message),
          error => observer.error(error),
          () => observer.complete()
        );

        this.subject = subject;
        return () => {
          if (!subscription.closed) {
            subscription.unsubscribe();
          }
        };
      } catch (e) {
        observer.error(e);
      }
    });
  }

  private parseWebSocketMessage(message: WebSocketPayload): void {
    const handler = this.handlers[message.type];
    if (handler) {
      handler(message.data);
      return;
    }

    console.warn(
      `received unknown web socket message of type ${message.type}`,
      message.data
    );
  }
}
