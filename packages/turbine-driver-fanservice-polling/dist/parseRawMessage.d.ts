declare const parseRawMessage: (message: FanserviceMessage) => {
    type: string;
    payload: any;
};
export default parseRawMessage;
