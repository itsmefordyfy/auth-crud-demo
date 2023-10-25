import { ReactNode, useEffect, useState } from "react";
import { UseQueryResult } from "react-query";

export const QueryView = <T,>({
  query,
  loadingView,
  loadedView,
}: QueryViewProps<T>) => {
  const { isLoading, refetch, data } = query;

  if (isLoading) {
    return <>{loadingView}</>;
  }

  return loadedView(data, refetch);
};

export interface QueryViewProps<T> {
  query: UseQueryResult<T | undefined, unknown>;
  loadingView?: ReactNode;
  loadedView: (data: T | undefined, refetch: () => void) => ReactNode;
}
