interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
}

function Button({ text, onClick, disabled, type }: ButtonProps): JSX.Element {
  return (
    <button
      className="rounded-md p-2 bg-tertiary dark:bg-secondary text-primary dark:text-quaternary w-full border-none focus:outline-none placeholder:text-gray-500 dark:placeholder:text-[#9CA3AF] dark:hover:bg-tertiary dark:hover:text-primary hover:bg-primary hover:text-quaternary transition-all duration-300 ease-in-out"
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {text}
    </button>
  );
}

export default Button;
