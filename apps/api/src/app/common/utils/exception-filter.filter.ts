import { Catch, ArgumentsHost, Logger, Inject, HttpServer } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {

    constructor(
        applicationRef?: HttpServer,
    ) {
        super(applicationRef);
    }

    catch(
        exception: unknown,
        host: ArgumentsHost,
    ) {
        super.catch(exception, host);
    }
}