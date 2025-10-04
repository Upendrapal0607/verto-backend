type TemplateSegment = {
    raw: string;
    isVariable: boolean;
    name: string | null;
    index: number;
};

export const ParamParser = (
 
    template: string,
) => {
    const templateParts: TemplateSegment[] = template.split('/').map((raw, index) => {
        const isVar = raw.match(/^{[^\/]+}$/);
        return {
            raw,
            isVariable: !!isVar,
            name: isVar ? raw.substring(1, raw.length - 1) : null,
            index,
        };
    });
    return {
        parse: (
    
            path: string,
        ): Record<string, string> => {
            const params: Record<string, string> = {};
            const pathParts = path.split('/');
            for (const segment of templateParts) {
                const pathPart = pathParts[segment.index];
                if (segment.isVariable) {
                    params[segment.name!] = pathPart;
                    continue;
                }
                if (segment.raw !== pathPart) {
                    return params;
                }
            }
            return params;
        },
    };
};

export type ParamParser = ReturnType<typeof ParamParser>;
