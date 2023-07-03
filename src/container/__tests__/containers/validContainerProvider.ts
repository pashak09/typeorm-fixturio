import { InjectDependency, ServiceContainerInterface } from 'fixturio';

export async function containerProvider(): Promise<ServiceContainerInterface> {
  return {
    getService<TInput = unknown, TResult = TInput>(
      _typeOrToken: InjectDependency<TInput> | string
    ): TResult {
      return <TResult>{};
    },
  };
}
