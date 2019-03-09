import { Component } from '@angular/core';
import { ChatbotService } from './chatbot.service';
import { Router } from '@angular/router';
import { Message } from './types/message';
import User from './types/user';
import { AmplifyService } from 'aws-amplify-angular';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent {

  title = 'Chat Bot';
  messages: Message[] = [];
  user: User;

  constructor(private chatBotService: ChatbotService, private amplifyService: AmplifyService, public router: Router) {
  }

  ngOnInit() {
    Auth.currentSession().then(session => {
      this.user = {
        username: session.getIdToken().payload["cognito:username"],
        email: session.getIdToken().payload['email'],
        phone_number: session.getIdToken().payload['phone_number'],
        cognitoId: session.getIdToken().payload['sub'],
      };
    });
  }

  private getChatResponse(userQuery: string): void {
    this.chatBotService.getChatResponse(userQuery).subscribe(data => {
      this.messages.push({
        query: userQuery,
        response: data["message"]
      });
    });
  }

  signOut() {
    this.amplifyService.auth().signOut();
    this.router.navigate(['/']);
  }

}
