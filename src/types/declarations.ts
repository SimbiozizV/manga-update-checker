declare const __DEV__: boolean;

declare type ClassName = {
    className?: string;
};

declare module '*.png' {
    const url: string;
    export default url;
}
