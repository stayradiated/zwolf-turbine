"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fanout_helpers_1 = require("@mishguru/fanout-helpers");
const constants_1 = require("./constants");
const parseRawMessage = (message) => {
    const type = message && message.TopicArn
        ? fanout_helpers_1.decodeNameFromTopicArn(constants_1.FANOUT_ENV, message.TopicArn)
        : '';
    const payload = message && message.Message ? JSON.parse(message.Message) : {};
    return {
        type,
        payload,
    };
};
exports.default = parseRawMessage;
//# sourceMappingURL=parseRawMessage.js.map