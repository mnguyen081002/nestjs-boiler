export class ResponseDefault<T> {
  message: string;
  data: T;

  constructor(message: string, data?: T) {
    this.message = message ? message : "Thành công";
    this.data = data ? data : null;
  }
}
