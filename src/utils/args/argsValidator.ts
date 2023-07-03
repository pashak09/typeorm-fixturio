import { Options } from '@app/runner';
import { RawOptions } from '@app/utils/args/argumentsParser';

export class ArgsException extends Error {}

export function argsValidator(args: RawOptions): asserts args is Options {
  const { filePatterns, dataSourceFile } = args;

  if (filePatterns === undefined) {
    throw new ArgsException(
      'filePatterns is required. Please specify a ts config path `filePatterns=<filePatterns>`'
    );
  }

  if (dataSourceFile === undefined) {
    throw new ArgsException(
      'dataSourceFile is required. Please specify a ts config path `dataSourceFile=<dataSourceFile>`'
    );
  }
}
