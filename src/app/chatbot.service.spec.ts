import { TestBed } from '@angular/core/testing';

import { ChatbotService } from './chat-bot/chatbot.service';

describe('ChatbotService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatbotService = TestBed.get(ChatbotService);
    expect(service).toBeTruthy();
  });
});
