import { omit } from 'radash';

export class LumoError<TMetadata extends Record<string, unknown> = Record<string, unknown>> extends Error {
  metadata: Omit<TMetadata, 'key' | 'cause'>;
  key: string;
  status: number = 500;
  override cause?: Error | string | undefined;

  constructor(message: string, metadata: TMetadata & { key: string; cause?: Error | string }) {
    super(message);

    this.key = metadata.key;
    this.cause = metadata.cause;
    this.metadata = omit(metadata, ['key', 'cause']);
    Object.setPrototypeOf(this, new.target.prototype);
    this.logError();
  }

  private logError() {
    const details = {
      name: this.name,
      message: this.message,
      status: this.status,
      key: this.key,
      metadata: this.metadata,
      cause: this.cause instanceof Error
        ? { message: this.cause.message, stack: this.cause.stack }
        : this.cause,
      stack: this.stack,
    };
    console.error("LumoError:", JSON.stringify(details, null, 2));
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      key: this.key,
      metadata: this.metadata,
      cause: this.cause instanceof Error 
        ? { message: this.cause.message, stack: this.cause.stack }
        : this.cause,
      stack: this.stack,
    };
  }

  override toString() {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}

export class BadRequestError extends LumoError { override status = 400; }
export class NotAuthenticatedError extends LumoError { override status = 401; }
export class NotAuthorizedError extends LumoError { override status = 403; }
export class NotFoundError extends LumoError { override status = 404; }
export class RateLimitError extends LumoError { override status = 429; }
export class InternalServerError extends LumoError { override status = 500; }
export class ConflictError extends LumoError { override status = 409; }
