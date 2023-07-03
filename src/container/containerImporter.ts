import { ServiceContainerInterface } from 'fixturio';

export class ContainerImporterException extends Error {}

/**
 * @throws ContainerImporterException
 */
export async function containerImporter(containerFile: string): Promise<ServiceContainerInterface> {
  const { containerProvider } = await import(containerFile);

  if (typeof containerProvider !== 'function') {
    throw new ContainerImporterException(
      'Exported file should provide a containerProvider function'
    );
  }

  const container = await containerProvider();

  if (typeof container.getService !== 'function') {
    throw new ContainerImporterException(
      'Provided container should implement ServiceContainerInterface'
    );
  }

  return <ServiceContainerInterface>container;
}
