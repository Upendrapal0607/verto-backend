import { ParamParser } from './param-parser';
import { Props, NextFunc } from '../../core/types';

type PathParser = {
    parse: (path: string) => Record<string, string>;
};

export async function withPathParser<TProps extends Props, TResult>(
    func: NextFunc<TProps, TResult>, 
    parser: PathParser, 
    props: TProps
): Promise<TResult> {
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
    } as TProps);
}

export const usePathParser = <TProps extends Props = Props>(template: string) => {
    const parser = ParamParser(template);
    return <TResult>(func: NextFunc<TProps, TResult>) => {
        return (props: TProps) => withPathParser(func, parser, props);
    };
};
