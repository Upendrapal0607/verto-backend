import Koa from 'koa';
// import cookie from "cookie";
import { isPromise, try as tryit } from 'radash';
import { LumoError, props, response } from '../../core/index';

export type KoaFramework = {
    req: Koa.Request;
    res: Koa.Response;
};

export type UseKoaOptions = {
    skipJson?: boolean; // Not Implemented
    skipCompression?: boolean; // Not Implemented
};

async function withKoa(func: KoaFunc, options: UseKoaOptions, ctx: Koa.Context, next: Koa.Next) {
    const [error, result] = await tryit(async () => {
        if (isPromise(func)) {
            func = await func;
        }
        return await func({
            ...props(),
            request: makeRequest(ctx),
            framework: {
                ctx,
                next,
            },
        });
    })();

    if (error && !(error instanceof LumoError)) {
        console.error(error);
    }
    const finalResponse = response(error, result);
    setResponse(ctx, finalResponse);
    return finalResponse;
}

export interface PropsFromKoa {
    request: {
        url: string;
        path: string;
        files: any;
        method: string;
        ip: string;
        startedAt: number;
        protocol: string;
        httpVersion: string;
        headers: Record<string, string | string[]>;
        // cookies: Record<string, string>;
        body: Record<string, any> | string | null;
        query: Record<string, any> | string | null;
        params: Record<string, any> | string | null;
    };
    framework: {
        ctx: Koa.Context;
        next: Koa.Next;
    };
    response: {};
    services: {};
}

const makeRequest = (ctx: Koa.Context) => ({
    url: ctx.originalUrl,
    path: ctx.path,
    files: (ctx.request as any).files,
    method: ctx.method,
    ip: ctx.ip,
    startedAt: Date.now(),
    protocol: ctx.request.protocol,
    httpVersion: ctx.req.httpVersion,
    headers: ctx.headers,
    body: (ctx.request as any).body,
    query: ctx.query,
    params: ctx.params || {},
});

type KoaFunc = (args: PropsFromKoa) => Promise<any>;

export const useKoa =
    (options: UseKoaOptions = {}) =>
    (func: KoaFunc) =>
    async (ctx: Koa.Context, next: Koa.Next) =>
        withKoa(func, options, ctx, next);

function setResponse(ctx: Koa.Context, { status, headers, body, cookies = null }) {
    ctx.status = status;
    for (const [key, val] of Object.entries(headers as Record<string, string>)) {
        ctx.set(key, val);
    }

    ctx.body = body;
}
