import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { AuthGuard } from './auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ChatBotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AmplifyAngularModule
  ],
  providers: [AmplifyService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule { }
