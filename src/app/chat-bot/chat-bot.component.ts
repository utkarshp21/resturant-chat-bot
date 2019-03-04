import { Component } from '@angular/core';
import { ChatbotService } from './chatbot.service';

import { Message } from '../message';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent {

  title = 'Chat Bot';
  messages: Message[] = [];

  constructor(private chatBotService: ChatbotService) {
  }

  getChatResponse(queryMessage: string): void {
    this.chatBotService.getChatResponse().subscribe(data => {
      this.messages.push({
        query: queryMessage,
        response: data["body"]
      });
    });
  }

}
