// import { omit } from 'radash';

// type LumoErrorMetadata = Record<string, any> & { key: string; cause?: Error | string };

// export class LumoError<TMetadata extends Record<string, any> = Record<string, any>> extends Error {
//   metadata: Omit<TMetadata, 'key' | 'cause'>;
//   key: string;
//   status: number = 500;
//   cause?: Error | string;

//   constructor(message: string, metadata: TMetadata & { key: string; cause?: Error | string }) {
//     super(message);
//     this.key = metadata.key;
//     this.cause = metadata.cause;
//     this.metadata = omit(metadata, ['key', 'cause']);
//     Object.setPrototypeOf(this, new.target.prototype);
//   }
// }


// export class BadRequestError extends LumoError {
//   status = 400;
// }

// export class NotAuthenticatedError extends LumoError {
//   status = 401;
// }

// export class NotAuthorizedError extends LumoError {
//   status = 403;
// }

// export class NotFoundError extends LumoError {
//   status = 404;
// }

// export class RateLimitError extends LumoError {
//   status = 429;
// }

// export class InternalServerError extends LumoError {
//   status = 500;
// }

// export class ConflictError extends LumoError {
//   status = 409;
// }



import { omit } from 'radash';

type LumoErrorMetadata = Record<string, any> & { key: string; cause?: Error | string };

export class LumoError<TMetadata extends Record<string, any> = Record<string, any>> extends Error {
  metadata: Omit<TMetadata, 'key' | 'cause'>;
  key: string;
  status: number = 500;
  cause?: Error | string;

  constructor(message: string, metadata: TMetadata & { key: string; cause?: Error | string }) {
    super(message);

    this.key = metadata.key;
    this.cause = metadata.cause;
    this.metadata = omit(metadata, ['key', 'cause']);
    Object.setPrototypeOf(this, new.target.prototype);

    // 👇 Automatically log the error when it’s created
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
    console.error("🔥 LumoError:", JSON.stringify(details, null, 2));
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

  toString() {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}

export class BadRequestError extends LumoError { status = 400; }
export class NotAuthenticatedError extends LumoError { status = 401; }
export class NotAuthorizedError extends LumoError { status = 403; }
export class NotFoundError extends LumoError { status = 404; }
export class RateLimitError extends LumoError { status = 429; }
export class InternalServerError extends LumoError { status = 500; }
export class ConflictError extends LumoError { status = 409; }
