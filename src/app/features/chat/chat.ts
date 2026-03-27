import {Component, OnDestroy, signal} from '@angular/core';
import {ChatMessage, ChatService} from './services/chat.service';
import {HlmButtonImports} from '@spartan-ng/helm/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HlmInputImports} from '@spartan-ng/helm/input';
import {HlmLabel} from '@spartan-ng/helm/label';
import {email, form, FormField, minLength, required} from '@angular/forms/signals';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-chat',
  imports: [
    HlmButtonImports,
    ReactiveFormsModule,
    HlmInputImports,
    HlmLabel,
    FormField,
    FormsModule
  ],
  templateUrl: './chat.html',
})
export class Chat implements OnDestroy {
  constructor(
    private chatService: ChatService
  ) {}

  //region: ---Form
  model = signal({
    name: '',
    message: '',
    // isActive: false,
  });

  userEditForm = form(this.model, schemaPath => {
    required(schemaPath.name, {message: "Username is required"})
    required(schemaPath.message, {message: "Message is required"})
  });

  //endregion: ---Form

  

  messages = signal<ChatMessage[]>([])

  isConnected = signal<boolean>(false)

  greetingsSubscription?: Subscription;
  messagesSubscription?: Subscription;

  onConnect() {
    this.chatService.connect().subscribe(success => {
      if (success) {
        this.isConnected.set(true);
        this.chatService.sendHello(this.model().name)

        this.greetingsSubscription = this.chatService.listenGreetings().subscribe(greetingMsg => {
          this.messages.update(old => [...old, new ChatMessage("server", greetingMsg)])
        })

        this.messagesSubscription = this.chatService.listenMessages().subscribe(chatMsg => {
          this.messages.update(old => [...old, chatMsg])
        })
      }
    });
  }

  onSend() {
    this.chatService.sendMessage(this.model().message)
  }

  onDisconnect() {
    this.chatService.disconnect()
    this.messagesSubscription?.unsubscribe();
    this.greetingsSubscription?.unsubscribe();
    this.isConnected.set(false)
  }

  ngOnDestroy() {
    if(this.isConnected()) this.onDisconnect();
  }
}
