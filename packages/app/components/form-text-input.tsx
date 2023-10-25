import { TextInput, TextInputProps } from "react-native-paper";
import { FormProps, FormRecord } from "./form-state";

export const FormTextInput = <T extends FormRecord>(
  props: FormTextInputProps<T>
) => {
  const { fieldName } = props;
  const { state: formState, setState: setFormState } = props.formState;

  const handleOnChange = (inputText: string) => {
    setFormState({ ...formState, [fieldName]: inputText });
    props.onChangeText?.(inputText);
  };

  return (
    <TextInput
      value={formState[fieldName]}
      mode="outlined"
      style={{ margin: 4 }}
      {...props}
      onChangeText={handleOnChange}
    />
  );
};

export type FormTextInputProps<T extends FormRecord> = FormProps<T> &
  TextInputProps;
