export type Request = {
    url: string;
    path: string;
    method: string;

    ip: string;
    /**
     * Milliseconds timestamp when the request started
     */
    startedAt: number;
    httpVersion: string;
    protocol: string;
    headers: Record<string, string | string[]>;
    query: Record<string, string>;
    params: Record<string, string>;
    body: Record<string, any> | string | null;
};

export type ResponseBody = {
    statusCode: number;
    success: boolean;
    data?: SerializableJson;
    error?: {
        message: string;
        key: string;
    };
    pagination?: {
        page: number;
        limit: number;
        total: number;
        count: number;
    };
};

export type Response = {
    type: '@response';
    headers: Record<string, string | string[]>;
    status: number;
    body: ResponseBody;
};

export type Props<
    TArgs extends {} = {},
    TServices extends {} = {},
    TAuth extends {} = {},
    TRequest extends Request = Request,
    TFramework extends {} = {},
> = {
    auth: TAuth;
    args: TArgs;
    services: TServices;
    request: TRequest;
    response: Response;
    framework: TFramework;
};

export type NextFunc<TProps extends Props = Props, TResult = any> = (props: TProps) => Promise<TResult>;

export type SerializableJson =
    | string
    | number
    | boolean
    | null
    | Date
    | SerializableJson[]
    | { [key: string]: SerializableJson };

export type InferProps<TFunc extends { (...args: any[]): any; _props: any }> = TFunc['_props'];
