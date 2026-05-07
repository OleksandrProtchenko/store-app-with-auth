interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  className,
  disabled,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}
