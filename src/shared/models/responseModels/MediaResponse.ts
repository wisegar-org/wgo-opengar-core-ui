import { SuccessResponse } from './BasicResponse'

export class SaveImageResponse extends SuccessResponse {
    urlImage: string
    idImage: number
    /**
     *
     */
    constructor(id: number, url: string) {
        super();
        this.idImage = id;
        this.urlImage = url;
    }
}