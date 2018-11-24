"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockPublish = async (message) => {
    console.log(`Publishing message: ${JSON.stringify(message, null, 2)}`);
};
const mockSubscribe = async (options) => {
    options.events.forEach((event) => {
        const [type] = event;
        console.log(`Subscribing to message type: "${type}"`);
    });
};
const createDriver = (options = {}) => {
    const { publish = mockPublish, subscribe = mockSubscribe } = options;
    return {
        publish,
        subscribe,
    };
};
exports.default = createDriver;
//# sourceMappingURL=index.js.map