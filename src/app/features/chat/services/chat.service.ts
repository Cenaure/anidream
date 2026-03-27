import { Injectable } from '@angular/core';
import {environment} from '../../../../env/dev.env';
import {Observable, of} from 'rxjs';
import {Client, over, Subscription} from 'stompjs';
import {MessageService} from '../../../shared/services/message.service';

//TODO
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  nickName: string = '';

  greetingsSubscription?: Subscription;
  messagesSubscription?: Subscription;

  url = environment.websocketUrl;
  socket?: WebSocket;
  stompClient?: Client;

  connect(): Observable<boolean> {
    return new Observable(subscriber => {
      this.socket = new WebSocket(this.url);
      this.stompClient = over(this.socket);

      this.stompClient.connect({}, frame => {
        subscriber.next(true);
        this.messageService.success("Connected")
        subscriber.complete()
      }, error => {
        subscriber.next(false);
        this.messageService.error("Cannot connect to WebSocket server");
        subscriber.complete()
      })

    })
  }

  disconnect() {
    this.greetingsSubscription?.unsubscribe();
    this.messagesSubscription?.unsubscribe();
    this.stompClient?.disconnect(() => {
      this.messageService.success("Disconnected")
    })
    this.socket?.close();
  }

  sendHello(name: string) {
    this.nickName = name;
    this.stompClient?.send("/app/hello", {}, JSON.stringify({ name }));
  }

  sendMessage(messageToSend: string) {
    const chatMessage = new ChatMessage(this.nickName, messageToSend)
    this.stompClient?.send("/app/message", {}, JSON.stringify(chatMessage));
  }

  listenGreetings(): Observable<string> {
    return new Observable(subscriber => {
      this.greetingsSubscription = this.stompClient?.subscribe("/topic/greetings", packet => {
        const message: string = JSON.parse(packet.body).content;
        subscriber.next(message);
      })
    })
  }

  listenMessages(): Observable<ChatMessage> {
    return new Observable(subscriber => {
      this.messagesSubscription = this.stompClient?.subscribe("/topic/messages", packet => {
        const message: ChatMessage = JSON.parse(packet.body);
        subscriber.next(message);
      })
    })
  }
}

export class ChatMessage {
  constructor(
    public name: string,
    public message: string,
  ) {}
}
