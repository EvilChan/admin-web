import { FC } from "react";
import { Input, InputProps, DatePicker, GetProps, Select, SelectProps } from "antd";

const { RangePicker } = DatePicker;

type DateRangePickerProps = GetProps<typeof RangePicker>;

export type InputType = "text" | "daterange" | "datetimerange" | "select";

export type InputMap<T extends InputType = InputType> = T extends "text"
    ? InputProps
    : T extends "daterange"
      ? DateRangePickerProps
      : T extends "datetimerange"
        ? DateRangePickerProps
        : T extends "select"
          ? SelectProps
          : never;

type DynamicInputProps<T extends InputType = InputType> = InputMap<T> & {
    inputType?: T;
};

const DynamicInput: FC<DynamicInputProps> = (props) => {
    const { inputType, ...others } = props;
    switch (inputType) {
        case "text":
            return <Input {...(others as InputProps)} />;
        case "daterange":
            return <DatePicker.RangePicker format="YYYY-MM-DD" {...(others as DateRangePickerProps)} />;
        case "datetimerange":
            return <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm" {...(others as DateRangePickerProps)} />;
        case "select":
            return <Select placeholder="请选择" {...(others as SelectProps)} />;
        default:
            return <></>;
    }
};

export default DynamicInput;
