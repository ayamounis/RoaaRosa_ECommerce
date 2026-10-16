import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: Record<string, any> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        if (Array.isArray(resObj.message)) {
          // Class-validator returns an array of string messages
          message = resObj.message.join('; ');
          errors = {
            msg: resObj.message[0],
            details: resObj.message,
          };
        } else if (resObj.message) {
          message = resObj.message;
          errors = { msg: resObj.message };
        } else {
          message = JSON.stringify(resObj);
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack);
    }

    const isClientError = status >= 400 && status < 500;
    const statusMsg = isClientError ? 'fail' : 'error';

    // Frontend compatibility format:
    // Some pages inspect res.statusMsg === 'fail', some read res.message, some read res.errors.msg
    response.status(status).json({
      statusMsg,
      message,
      errors: Object.keys(errors).length > 0 ? errors : { msg: message },
      statusCode: status,
    });
  }
}
