/**
 * 网络异常基类
 */
export class HttpBaseError extends Error {
  constructor(context) {
    super(context.message);
    this.status = context.status;
    this.message = context.message;
    this.config = context.config;
    this.request = context.request;
    this.response = context.response;
  }
}

/**
 * 网络请求系统异常
 */
export class HttpSystemError extends HttpBaseError {}

/**
 * 网络请求业务异常
 */
export class HttpBusinessError extends HttpBaseError {}

/**
 * 网络请求服务异常
 */
export class HttpServiceError extends HttpBaseError {}
