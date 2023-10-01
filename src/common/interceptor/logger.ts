import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { stringify } from "querystring";
import { throwError } from "rxjs";
import { tap, catchError, mergeMap, finalize, map, combineLatestAll } from "rxjs/operators";
import { v4 } from "uuid";
@Injectable()
export class HTTPLogger implements NestInterceptor {
  private logger: Logger = new Logger(HTTPLogger.name);
  intercept(context: ExecutionContext, next: CallHandler) {
    let log;

    const start = Date.now();
    const request = context.switchToHttp().getRequest();

    const { originalUrl, method, ip } = request;

    const userAgent = request.get("user-agent") || "";

    const exculdedPaths = ["/health", "/metrics", "/favicon.ico"];
    let d;
    const requestId = request.headers["x-request-id"] || v4();
    this.logger.log(
      `Request: ${requestId} ${method} ${originalUrl} - ${JSON.stringify(
        request.body,
      )} - ${userAgent} ${ip}`,
    );

    return next.handle().pipe(
      catchError((err) => {
        log = (data) => this.logger.error(data);
        d = { ...err.response, stack: err.response?.error?.stack };

        if (err.response?.error) {
          delete err.response.error;
        }
        return throwError(() => {
          return err;
        });
      }),
      tap((data: any) => {
        log = (data) => this.logger.log(data);
        d = data;
        return data;
      }),
      finalize(() => {
        const response = context.switchToHttp().getResponse();
        response.on("finish", () => {
          const { statusCode } = response;
          const duration = Date.now() - start;
          const contentLength = response.get("content-length");

          for (const path of exculdedPaths) {
            if ((originalUrl as string).includes(path)) {
              return;
            }
          }

          log(
            `Request: ${requestId} {${method} ${originalUrl} ${statusCode} - ${JSON.stringify(
              request.body,
            )} - ${userAgent} ${ip} Response: { ${JSON.stringify({
              ...d,
            })} - ${contentLength} - ${duration}ms }`,
          );
        });
      }),
    );
  }
}
