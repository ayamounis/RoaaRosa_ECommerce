import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(
    @Inject(ChatbotService) private readonly chatbotService: ChatbotService,
  ) {}

  @Post('message')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send a message to the AI chatbot',
    description:
      'Public endpoint — no authentication required. Supports Arabic and English. ' +
      'The chatbot answers questions about products, prices, availability, and categories ' +
      'using live database data.',
  })
  @ApiBody({ type: ChatMessageDto })
  @ApiOkResponse({
    description: 'Chatbot reply with optional product results',
    schema: {
      type: 'object',
      properties: {
        reply: {
          type: 'string',
          example: 'I found 3 product(s) for you 🎉:\n\n• Summer Dress — 299.99 EGP ⭐ 4.5',
        },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              price: { type: 'number' },
              priceAfterDiscount: { type: 'number', nullable: true },
              imageCover: { type: 'string' },
              ratingsAverage: { type: 'number' },
              ratingsQuantity: { type: 'number' },
            },
          },
          nullable: true,
        },
        sessionId: { type: 'string', nullable: true, example: 'session_abc123' },
      },
    },
  })
  async processMessage(@Body() dto: ChatMessageDto) {
    return this.chatbotService.processMessage(dto);
  }
}
