import { ArgsException, argsValidator } from '@app/utils/args/argsValidator';
import { RawOptions } from '@app/utils/args/argumentsParser';

describe('argsValidator', () => {
  const validArgs = {
    recreate: true,
    runMigration: true,
    quiet: false,
    containerPath: 'path/to/container',
    dataSourceFile: 'path/to/dataSource',
    filePatterns: ['pattern1', 'pattern2'],
  };

  it('does not throw an error for valid args', () => {
    expect(() => argsValidator(validArgs)).not.toThrow();
  });

  it('throws an ArgsException when filePatterns is undefined', () => {
    const args: RawOptions = { ...validArgs, filePatterns: undefined };

    expect(() => argsValidator(args)).toThrow(ArgsException);
    expect(() => argsValidator(args)).toThrow(
      'filePatterns is required. Please specify a ts config path `filePatterns=<filePatterns>`',
    );
  });

  it('throws an ArgsException when dataSourceFile is undefined', () => {
    const args: RawOptions = { ...validArgs, dataSourceFile: undefined };

    expect(() => argsValidator(args)).toThrow(ArgsException);
    expect(() => argsValidator(args)).toThrow(
      'dataSourceFile is required. Please specify a ts config path `dataSourceFile=<dataSourceFile>`',
    );
  });
});
