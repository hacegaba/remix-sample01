import { useEffect, useState } from "react";

interface FormFieldProps {
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  onChange?: (...args: any) => any;
  error?: string;
}

export function FormField({
  htmlFor,
  label,
  type = "text",
  value,
  onChange = () => {},
  error = "",
}: FormFieldProps) {
  const [errorText, setErrorText] = useState(error);

  useEffect(() => {
    setErrorText(error);
  }, [error]);

  return (
    <>
      <label htmlFor={htmlFor} className="text-grey-500">
        {label}
      </label>
      <input
        onChange={(e) => {
          onChange(e);
          setErrorText("");
        }}
        type={type}
        id={htmlFor}
        name={htmlFor}
        className="w-full p-2 rounded-l my-2"
        value={value}
      />
      <div
        hidden={!errorText}
        className="w-full p-1 rounded-l text-xs font-semibold text-center tracking-wide bg-red-600 text-white"
      >
        {errorText || ""}
      </div>
    </>
  );
}
