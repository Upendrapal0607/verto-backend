import { ParamParser } from './param-parser';

export async function withPathParser(func:any, parser:any, props:any) {
    const params = parser.parse(props.request.path);
    return await func({
        ...props,
        request: {
            ...props.request,
            params: {
                ...props.request.params,
                ...params,
            },
        },
    });
}

export const usePathParser = (template:any) => {
    const parser = ParamParser(template);
    return (func:any) => {
        return (props:any) => withPathParser(func, parser, props);
    };
};
