interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}

export default function Button({ children, className, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
