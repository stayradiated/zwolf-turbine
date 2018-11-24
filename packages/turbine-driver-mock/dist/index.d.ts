import { PublishFn, SubscribeFn } from '@mishguru/turbine-types';
interface Options {
    publish?: PublishFn;
    subscribe?: SubscribeFn;
}
declare const createDriver: (options?: Options) => {
    publish: PublishFn;
    subscribe: SubscribeFn;
};
export default createDriver;
