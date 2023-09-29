import { TextInput, TextInputProps } from "react-native-paper";
import { FormProps, FormRecord } from "./FormProps";
import { useCallback } from "react";

export const FormTextInput = <T extends FormRecord>(
  props: FormTextInputProps<T>
) => {
  const fieldName = props.fieldName;
  const { state: formState, setState: setFormState } = props.formState;

  const handleOnChange = useCallback(
    (inputText: string) => {
      setFormState({ ...formState, [fieldName]: inputText });
      props.onChangeText?.(inputText);
    },
    [props.formState]
  );

  return (
    <TextInput
      value={formState[fieldName]}
      style={{ margin: 4 }}
      {...props}
      onChangeText={handleOnChange}
    />
  );
};

export type FormTextInputProps<T extends FormRecord> = FormProps<T> &
  TextInputProps;
