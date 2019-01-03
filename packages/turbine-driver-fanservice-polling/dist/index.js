"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscribe_1 = __importDefault(require("./subscribe"));
const publish_1 = __importDefault(require("./publish"));
const createDriver = () => ({
    publish: publish_1.default,
    subscribe: subscribe_1.default,
});
exports.default = createDriver;
//# sourceMappingURL=index.js.map