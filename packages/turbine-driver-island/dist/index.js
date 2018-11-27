"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const publish = async (message) => {
    console.log(`Publishing message: ${JSON.stringify(message, null, 2)}`);
};
const subscribe = async (options) => {
    return options;
};
const createDriver = () => {
    return {
        publish,
        subscribe,
    };
};
exports.default = createDriver;
//# sourceMappingURL=index.js.map