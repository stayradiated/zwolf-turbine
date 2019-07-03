"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatError = (error) => {
    return {
        message: error.toString(),
        stack: error.stack.toString(),
    };
};
exports.default = formatError;
//# sourceMappingURL=formatError.js.map