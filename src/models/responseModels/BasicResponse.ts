export class BasicResponse {
  success: boolean;
  message: string;
  /**
   *
   */
  constructor(success: boolean, message?: string) {
    this.success = success;
    this.message = message;
  }
}

export class SuccessResponse extends BasicResponse {
  /**
   *
   */
  constructor(message?: string) {
    super(true);
    this.message = message;
  }
}

export class ErrorResponse extends BasicResponse {
  /**
   *
   */
  constructor(message?: string) {
    super(false);
    this.message = message;
  }
}
