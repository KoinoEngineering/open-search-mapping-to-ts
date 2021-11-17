export default class StackError extends Error {
  constructor(public message: string, public stackError?: Error) {
    super(message);
  }

  public consoleStackTrace(level = 0) {
    /* eslint-disable no-console */
    console.group("level: " + level);
    console.error(this);
    if (this.stackError instanceof StackError) {
      this.stackError.consoleStackTrace(level + 1);
    } else {
      console.group("level: " + level);
      console.error(this.stackError);
      console.groupEnd();
    }
    console.groupEnd();
    /* eslint-enable no-console */
  }
}
