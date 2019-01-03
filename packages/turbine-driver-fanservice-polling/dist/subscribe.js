"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const raven_helper_1 = __importDefault(require("@mishguru/raven-helper"));
const fanout_helpers_1 = require("@mishguru/fanout-helpers");
const constants_1 = require("./constants");
const parseRawMessage_1 = __importDefault(require("./parseRawMessage"));
const HEALTH_CHECK = async () => undefined;
const subscribe = async (subscribeOptions) => {
    const { serviceName, events } = subscribeOptions;
    const routeMap = events.reduce((map, event) => {
        const [type, callback] = event;
        map.set(type, callback);
        return map;
    }, new Map());
    await fanout_helpers_1.createFanoutForEnvironment(constants_1.AWS_CREDENTIALS, constants_1.FANOUT_ENV);
    await pollForMessages(routeMap, serviceName);
};
const pollForMessages = async (routeMap, serviceName) => {
    try {
        const res = await fanout_helpers_1.authenticatedReceiveMessage(1, 60, serviceName);
        if (res != null && res.Messages != null && res.Messages.length > 0) {
            await Promise.all(res.Messages.map(async (message) => {
                await handleMessage(routeMap, serviceName, JSON.parse(message.Body));
                await fanout_helpers_1.authenticatedDeleteMessage(serviceName, message.ReceiptHandle);
            }));
        }
    }
    catch (error) {
        raven_helper_1.default.captureException(error);
    }
    finally {
        return pollForMessages(routeMap, serviceName);
    }
};
const handleMessage = async (routeMap, serviceName, rawMessage) => {
    const message = parseRawMessage_1.default(rawMessage);
    const { type, payload } = message;
    if (routeMap.has(type)) {
        const callback = routeMap.get(type);
        try {
            await callback({
                id: payload.__turbine__ != null ? payload.__turbine__.id : null,
                sentAt: payload.__turbine__ != null ? payload.__turbine.sentAt : null,
                type,
                payload,
            });
        }
        catch (error) {
            console.error(error);
            if (error != null || error.published === true) {
                const userId = payload.userId || 0;
                return fanout_helpers_1.rejectAnyway('unexpectedError', {
                    userId,
                    message,
                    info: `Unexpected error in "${serviceName}"`,
                    error: error.message,
                }, error);
            }
            throw error;
        }
    }
};
exports.default = subscribe;
//# sourceMappingURL=subscribe.js.map