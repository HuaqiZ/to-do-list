import React from "react";
import dayjs, { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { UseDateFieldProps } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from '@mui/x-date-pickers/models';

interface ButtonFieldProps
  extends UseDateFieldProps<Dayjs, false>,
    BaseSingleInputFieldProps<
      Dayjs | null,
      Dayjs,
      FieldSection,
      false,
      DateValidationError
    > {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CustomDatePickerProps {
  onValueChange: ( value: any ) => void;
  date?: Dayjs;
}

function ButtonField(props: ButtonFieldProps) {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  return (
    <Button
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      size="small"
      onClick={() => setOpen?.((prev) => !prev)}
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: 'fit-content', borderColor: 'black', color: 'black' }}
    >
      {label ? `${label}` : 'Pick a date'}
    </Button>
  );
}

export default function CustomDatePicker({date, onValueChange}: CustomDatePickerProps) {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs(date) ?? null); 
  const [open, setOpen] = React.useState(false);

  const handleDateChange = (newValue: Dayjs | null)  => {
    if (newValue) {
      setValue(newValue);
      const formattedDate = newValue.toISOString();
      onValueChange(formattedDate); 
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        label={value ? value.format('MMM DD, YYYY') : 'MM/DD/YYYY'}
        onChange={handleDateChange}
        slots={{ field: ButtonField }}
        slotProps={{
          field: { setOpen } as any,
          nextIconButton: { size: 'small' },
          previousIconButton: { size: 'small' },
        }}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        views={['day', 'month', 'year']}
      />
    </LocalizationProvider>
  );
}
