import { ReactNode, useEffect, useState } from "react";

export const PromiseView = <T,>({
  promise,
  loadingView,
  loadedView,
}: PromiseViewProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    promise
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, []);

  return <>{loading ? <>{loadingView}</> : <>{loadedView(data)}</>}</>;
};

export interface PromiseViewProps<T> {
  promise: Promise<T | null>;
  loadingView?: ReactNode;
  loadedView: (data: T | null) => ReactNode;
}
