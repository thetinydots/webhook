export declare type hookType = {
    path: string;
    type?: "GET" | "POST";
    action: <T = any, J = any, K = any, I = any>(data?: T, params?: K, query?: I) => J | Promise<J>;
};
export declare type hooksType = hookType[];
declare const webhook: (hooks: hooksType, PORT?: number, debug?: boolean) => void;
export default webhook;
