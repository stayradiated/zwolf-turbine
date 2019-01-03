declare module '@mishguru/raven-helper' {
  export default class Raven {
    static captureException (error: Error): void
  }
}
