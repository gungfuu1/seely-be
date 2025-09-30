import { ArgumentsHost, Catch, ConflictException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AppExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // QueryFailedError
    if (exception instanceof QueryFailedError) {
      const message: string = exception.message;
      if (message.includes('duplicate key value')) {
        const detail = (exception.driverError as any).detail;
        super.catch(new ConflictException(detail), host);
        return;
      }
    }

    // other exceptions
    super.catch(exception, host);
  }
}