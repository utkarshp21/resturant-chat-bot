import { Component } from '@angular/core';
import { ChatbotService} from './chatbot.service';

import { Message } from './message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  
  title = 'Chat Bot';
  messages: Message[] = [];

  constructor(private chatBotService: ChatbotService){
  }

  getChatResponse(queryMessage:string):void{
    this.chatBotService.getChatResponse().subscribe(data => {
        this.messages.push({
          query: queryMessage,
          response: data["body"]
        });
    });
  }

}
