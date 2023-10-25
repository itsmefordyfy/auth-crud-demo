import { useState } from "react";
export type FormRecord = Record<string, string>;

export type FormProps<T extends FormRecord> = {
  formState: FormState<T>;
  fieldName: keyof T;
};

export interface FormState<T extends FormRecord> {
  state: T;
  setState: (value: T) => void;
}

export function useFormState<T extends FormRecord>(
  defaultValues: T
): FormState<T> {
  const [state, setState] = useState(defaultValues);

  return { state, setState };
}
