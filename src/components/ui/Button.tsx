import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = "font-bold rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 border border-white/10",
    secondary: "glass-card text-text border border-white/10 hover:bg-white/10",
    ghost: "text-text-dim hover:text-text hover:bg-white/5",
    danger: "bg-danger text-white shadow-lg shadow-danger/20 hover:shadow-danger/40",
    icon: "glass-card text-text w-12 h-12 p-0 rounded-full border border-white/10 hover:bg-white/10 flex items-center justify-center"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-4 text-sm min-h-[48px]",
    lg: "px-8 py-5 text-lg min-h-[56px] w-full"
  };

  const css = `${base} ${variants[variant]} ${variant !== 'icon' ? sizes[size] : ''} ${className}`;

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.95 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      disabled={disabled || loading}
      className={css}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </motion.button>
  );
}
