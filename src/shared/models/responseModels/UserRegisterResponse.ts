import {  ErrorResponse } from './BasicResponse'

export class UserRegisterErrorResponse extends ErrorResponse {
    errorProperty: string
    /**
     *
     */
    constructor(errorProperty: string, message: string) {
        super(message);
        this.errorProperty = errorProperty;
    }
}