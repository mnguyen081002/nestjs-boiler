export class ResponseDefault {
  message: string;
  data: any;

  constructor(message?: string, data?: any) {
    this.message = message ? message : "Thành công";
    this.data = data ? data : null;
  }
}
