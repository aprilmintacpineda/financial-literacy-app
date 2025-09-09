import { type UseTRPCQueryResult } from '@trpc/react-query/shared';
import { type ComponentProps, useMemo } from 'react';
import MultiSelectOptions from './multi-select-options';

export type MultiSelectOptionsAsyncProps<TData> = Omit<
  ComponentProps<typeof MultiSelectOptions>,
  'options' | 'mapValueToLabel' | 'isLoading'
> & {
  queryResult: UseTRPCQueryResult<TData[], any>;
  mapDataToOptions: (
    data: TData
  ) => ComponentProps<typeof MultiSelectOptions>['options'][number];
};

export default function MultiSelectOptionsAsync<TData> ({
  queryResult,
  mapDataToOptions,
  isSearchable,
  ...selectOptionsProps
}: MultiSelectOptionsAsyncProps<TData>) {
  const { data, status, isRefetching } = queryResult;

  const options = useMemo(() => {
    return (data ?? []).map(mapDataToOptions);
  }, [data]);

  return (
    <MultiSelectOptions
      {...selectOptionsProps}
      mapValuesToLabel={values => {
        return values.reduce<string[]>((results, value) => {
          return results.concat(
            options.find(option => option.value === value)!.label,
          );
        }, []);
      }}
      options={options}
      isSearchable={
        isSearchable === false
          ? false
          : isSearchable || (data ?? [])?.length > 10
      }
      isLoading={status === 'pending' || isRefetching}
    />
  );
}
