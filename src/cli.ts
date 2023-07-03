#!/usr/bin/env node

import { ContainerImporterException } from '@app/container/containerImporter';
import { Logger, LogLevel } from '@app/logger/Logger';
import { runner } from '@app/runner';
import { ArgsException, argsValidator } from '@app/utils/args/argsValidator';
import { argumentsParser } from '@app/utils/args/argumentsParser';

(async (): Promise<void> => {
  const args = argumentsParser();
  const logger = new Logger(args.quiet === true ? LogLevel.ERROR : LogLevel.INFO);

  try {
    argsValidator(args);

    await runner(args);
  } catch (error: unknown) {
    if (error instanceof ArgsException || error instanceof ContainerImporterException) {
      logger.error(error.message);

      process.exit(1);
    }

    throw error;
  }
})();
