import { TextInput, TextInputProps } from "react-native-paper";
import { FormProps, FormRecord } from "./form-state";
import { DatePickerInput, en, registerTranslation } from "react-native-paper-dates";

registerTranslation("en", en);

export const FormDatePicker = <T extends FormRecord>(
  props: FormDatePickerProps<T>
) => {
  const { fieldName, label } = props;
  const { state: formState, setState: setFormState } = props.formState;

  const handleOnChange = (date: Date | undefined) => {
    setFormState({ ...formState, [fieldName]: date?.toJSON() });
  };

  let value: Date | undefined = undefined;

  try {
    const dateStr = formState[fieldName] as string | undefined;
    if (dateStr !== undefined) {
      if (dateStr.length > 8) {
        value = new Date(dateStr);
      }
    }
  } catch (_e) { };

  return (
    <DatePickerInput
      mode="outlined"
      locale="en"
      label={label}
      value={value}
      onChange={handleOnChange}
      inputMode="end"
      style={{ margin: 2, minWidth: 310 }}
    />
  );
};

export type FormDatePickerProps<T extends FormRecord> = FormProps<T> & {
  label?: string;
}
