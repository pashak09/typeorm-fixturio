export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export class Logger {
  private readonly terminalColors: Record<LogLevel, string>;

  constructor(private readonly logLevel: LogLevel) {
    this.terminalColors = {
      [LogLevel.DEBUG]: '\x1b[33m',
      [LogLevel.WARN]: '\x1b[33m',
      [LogLevel.INFO]: '\x1b[33m',
      [LogLevel.ERROR]: '\x1b[31m',
    };
  }

  error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }

  warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  debug(message: string): void {
    this.log(LogLevel.DEBUG, message);
  }

  private log(level: LogLevel, message: string): void {
    if (level > this.logLevel) {
      return;
    }

    const levelString = LogLevel[level].toUpperCase();
    const logEntry = `${new Date().toISOString()} [${levelString}] ${message}`;

    if (level <= LogLevel.WARN) {
      // eslint-disable-next-line no-console
      console.error(this.terminalColors[level], logEntry, '\x1b[0m');

      return;
    }

    // eslint-disable-next-line no-console
    console.log(this.terminalColors[level], logEntry, '\x1b[0m');
  }
}
