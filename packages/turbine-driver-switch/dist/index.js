"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createDriver = (driverName) => {
    const createDriver = require(`@mishguru/turbine-driver-${driverName}`);
    return createDriver();
};
exports.default = createDriver;
//# sourceMappingURL=index.js.map