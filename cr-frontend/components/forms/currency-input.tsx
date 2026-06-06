import { Input } from "@/components/ui/8bit/input";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const inputClassName =
  "font-mono text-xl py-6 pl-10 border-4 focus-visible:ring-0 focus-visible:border-primary";

export function CurrencyInput({ value, onChange, required }: CurrencyInputProps) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl text-muted-foreground">
        $
      </span>
      <Input
        type="number"
        min="0.01"
        step="0.01"
        className={inputClassName}
        placeholder="0.00"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
