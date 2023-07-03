import { resolve } from 'node:path';

import { containerImporter, ContainerImporterException } from '@app/container/containerImporter';

describe('containerImporter', () => {
  const containersPath = resolve(__dirname, 'containers');

  it('returns a valid container for a valid container file', async () => {
    const validContainerPath = resolve(containersPath, 'validContainerProvider.ts');
    const importedContainer = await containerImporter(validContainerPath);

    expect(importedContainer).toEqual({
      getService: expect.any(Function),
    });
  });

  it('throws a ContainerImporterException when containerProvider is not a function', async () => {
    const invalidContainerFile = resolve(containersPath, 'invalidContainerProvider.ts');

    await expect(containerImporter(invalidContainerFile)).rejects.toThrow(
      new ContainerImporterException('Exported file should provide a containerProvider function')
    );
  });

  it('throws a ContainerImporterException when provided container does not implement ServiceContainerInterface', async () => {
    const notImplimentedServiceContainerInterfaceFile = resolve(
      containersPath,
      'notImplementedServiceContainerInterface.ts'
    );

    await expect(containerImporter(notImplimentedServiceContainerInterfaceFile)).rejects.toThrow(
      new ContainerImporterException(
        'Provided container should implement ServiceContainerInterface'
      )
    );
  });
});
