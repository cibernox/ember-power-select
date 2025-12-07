export type MatcherFn = (option: any, text: string) => number;
export declare function isGroup(entry: any): boolean;
export declare function countOptions(collection: any): number;
export declare function indexOfOption(collection: any, option: any): number;
export declare function pathForOption(collection: any, option: any): string;
export declare function optionAtIndex(originalCollection: any, index: number): {
    disabled: boolean;
    option: any;
};
export interface Group {
    groupName: string;
    options: any[];
    disabled?: boolean;
    [key: string]: unknown;
}
export declare function findOptionWithOffset(options: any, text: string, matcher: MatcherFn, offset: number, skipDisabled?: boolean): any;
export declare function filterOptions(options: any, text: string, matcher: MatcherFn, skipDisabled?: boolean): any[];
export declare function defaultHighlighted<T>({ results, highlighted, selected, }: {
    results: T[];
    highlighted: T | undefined;
    selected: T | undefined;
}): T;
export declare function advanceSelectableOption(options: any, currentOption: any, step: 1 | -1): any;
export declare function stripDiacritics(text: string | number): string;
export declare function defaultMatcher(value: string, text: string): number;
export declare function defaultTypeAheadMatcher(value: string, text: string): 1 | -1;
//# sourceMappingURL=group-utils.d.ts.map