import { isNumber } from 'radash';
import type { Response, ResponseBody } from './types';
import { LumoError } from './error';

export const isResponse = (res: unknown): res is Response => {
    return typeof res === 'object' && res !== null && (res as Response).type === '@response';
};

export const defaultResponse: Response = {
    type: '@response',
    status: 200,
    headers: {},
    body: {
        statusCode: 200,
        success: true,
    },
};

export const responseFromResult = (result: unknown): Response => {
    if (isResponse(result)) {
        return result;
    }

    if (result === null) {
        return defaultResponse;
    }

    return {
        ...defaultResponse,
        body: {
            statusCode: 200,
            success: true,
            ...(result as Record<string, unknown>),
        },
    };
};

export const responseFromError = (error: unknown): Response => {
    if (isResponse(error)) {
        return error;
    }

    const build = (status: number, message: string, key: string): Response => ({
        ...defaultResponse,
        status,
        body: {
            statusCode: status,
            success: false,
            error: { message, key },
        },
    });

    if (error instanceof LumoError) {
        return build(error.status, error.message, error.key);
    }

    return build(500, 'Unknown Error', 'unknown_error');
};

export const response = (error: unknown, result: unknown): Response => {
    return error ? responseFromError(error) : responseFromResult(result);
};

export function res(): Response;
export function res(body: ResponseBody): Response;
export function res(status: number): Response;
export function res(status: number, body: ResponseBody): Response;

export function res(statusOrBody?: number | ResponseBody, body?: ResponseBody): Response {
    if (!statusOrBody && !body) {
        return defaultResponse;
    }

    return {
        ...defaultResponse,
        status: isNumber(statusOrBody) ? statusOrBody : 200,
        body: body
            ? body
            : isNumber(statusOrBody)
              ? { statusCode: 200, success: true }
              : (statusOrBody as ResponseBody),
    };
}
