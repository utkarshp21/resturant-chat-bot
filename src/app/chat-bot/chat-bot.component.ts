import { Component } from '@angular/core';
import { ChatbotService } from './chatbot.service';
import { Router } from '@angular/router';
import { Message } from '../message';
import { AmplifyService } from 'aws-amplify-angular';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent {

  title = 'Chat Bot';
  messages: Message[] = [];

  constructor(private chatBotService: ChatbotService, private amplifyService: AmplifyService, public router: Router) {
  }

  private getChatResponse(queryMessage: string): void {
    this.chatBotService.getChatResponse().subscribe(data => {
      this.messages.push({
        query: queryMessage,
        response: data["body"]
      });
    });
  }

  private signOut() {
    this.amplifyService.auth().signOut();
    this.router.navigate(['/']);
  }

}
