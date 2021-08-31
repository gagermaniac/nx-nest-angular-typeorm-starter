/* eslint-disable @typescript-eslint/no-explicit-any */
import { IResponse } from '@app/api-interfaces';

export class ResponseError implements IResponse {
    constructor(infoMessage: string, data?: any) {
        this.success = false;
        this.message = infoMessage;
        this.data = data;
        console.warn(new Date().toString() + ' - [Response]: ' + infoMessage + (data ? ' - ' + JSON.stringify(data) : ''));
    };
    message: string;
    data: any[];
    errorMessage: any;
    error: any;
    success: boolean;
}

export class ResponseSuccess implements IResponse {
    constructor(infoMessage: string, data?: any, notLog?: boolean) {
        this.success = true;
        this.message = infoMessage;
        this.data = data;
        if (!notLog) {
            try {
                const offuscateRequest = (data) ? JSON.parse(JSON.stringify(data)) : null;
                if (offuscateRequest && offuscateRequest.token) offuscateRequest.token = "*******";
                console.log(new Date().toString() + ' - [Response]: ' + JSON.stringify(offuscateRequest))
            } catch (error) {
                console.log(error)
            }
        };
    };
    message: string;
    data: any[];
    errorMessage: any;
    error: any;
    success: boolean;
}