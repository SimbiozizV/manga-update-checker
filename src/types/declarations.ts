/* eslint-disable @typescript-eslint/no-unused-vars -- ambient global declarations */
declare const __DEV__: boolean;

declare type ClassName = {
    className?: string;
};

declare module '*.png' {
    const url: string;
    export default url;
}
