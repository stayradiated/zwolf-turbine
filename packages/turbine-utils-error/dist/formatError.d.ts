declare const formatError: (error: Error) => {
    message: string;
    stack: string;
};
export default formatError;
