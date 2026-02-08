interface FormInputProps {
  label: string;
  htmlFor: string;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
}

function FormInput({
  label,
  htmlFor,
  type,
  onChange,
  value,
  placeholder,
  autoComplete,
  disabled,
  required,
  autoFocus
}: FormInputProps): JSX.Element {
  return (
    <div className="bg-tertiary dark:bg-secondary rounded-md p-2 mb-5">
      <label
        className={`text-xs ${
          required &&
          "after:content-['*'] after:ml-0.5 after:text-quaternary dark:after:text-primary"
        }`}
        htmlFor={htmlFor}
      >
        {label}
      </label>
      <input
        className="bg-tertiary dark:bg-secondary text-primary dark:text-quaternary w-full border-none focus:outline-none placeholder:text-gray-500 dark:placeholder:text-[#9CA3AF]"
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        autoFocus={autoFocus}
      />
    </div>
  );
}

export default FormInput;
