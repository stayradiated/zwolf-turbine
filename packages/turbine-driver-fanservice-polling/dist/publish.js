"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fanout_helpers_1 = require("@mishguru/fanout-helpers");
const publish = async (message) => {
    const { type, id, parentId, sentFrom, sentAt, payload } = message;
    await fanout_helpers_1.authenticatedPublish(type, Object.assign({}, payload, { __turbine__: {
            type,
            id,
            parentId,
            sentFrom,
            sentAt,
        } }));
};
exports.default = publish;
//# sourceMappingURL=publish.js.map