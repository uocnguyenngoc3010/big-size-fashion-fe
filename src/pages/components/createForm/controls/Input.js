import React from "react";
import { TextField } from "@material-ui/core";

export default function Input(props) {
  const {
    name,
    label,
    value,
    error = null,
    type,
    endadornment,
    onChange,
    multiline,
    fullWidth,
    disable,
  } = props;
  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      endAdornment={endadornment}
      multiline={multiline}
      fullWidth={fullWidth}
      disabled={disable}
      {...(error && { error: true, helperText: error })}
    />
  );
}
