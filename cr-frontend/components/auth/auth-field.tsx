import { Input } from "@/components/ui/8bit/input";

interface AuthFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

const inputClassName =
  "font-mono border-4 rounded-none h-12 text-center focus-visible:ring-0 focus-visible:border-primary";

export function AuthField({
  label,
  type = "text",
  value,
  onChange,
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <label className="form-label">{label}</label>
      <Input
        type={type}
        className={inputClassName}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=""
      />
    </div>
  );
}
