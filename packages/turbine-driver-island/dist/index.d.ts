import { PublishFn, SubscribeFn } from '@mishguru/turbine-types';
declare const createDriver: () => {
    publish: PublishFn;
    subscribe: SubscribeFn;
};
export default createDriver;
