import { type UseTRPCQueryResult } from '@trpc/react-query/shared';
import { type ComponentProps, useMemo } from 'react';
import SelectOptions from './select-options';

export type SelectOptionsAsyncProps<TData> = Omit<
  ComponentProps<typeof SelectOptions>,
  'options' | 'mapValueToLabel' | 'isLoading'
> & {
  queryResult: UseTRPCQueryResult<TData[], any>;
  mapDataToOptions: (
    data: TData
  ) => ComponentProps<typeof SelectOptions>['options'][number];
};

export default function SelectOptionsAsync<TData> ({
  queryResult,
  mapDataToOptions,
  isSearchable,
  ...selectOptionsProps
}: SelectOptionsAsyncProps<TData>) {
  const { data, status, isRefetching } = queryResult;

  const options = useMemo(() => {
    return (data ?? []).map(mapDataToOptions);
  }, [data]);

  return (
    <SelectOptions
      {...selectOptionsProps}
      mapValueToLabel={value => {
        if (!value || !options.length) return '';
        return options.find(option => option.value === value)!.label;
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
