import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";

interface AuthFormShellProps {
  error?: React.ReactNode;
  children: React.ReactNode;
}

export function AuthFormShell({ error, children }: AuthFormShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background retro-scanline p-4">
      <Card
        frame="primary"
        className="w-full max-w-sm retro-shadow bg-card retro"
      >
        <CardHeader className="text-center border-b-4 pb-6">
          <CardTitle className="text-4xl font-black tracking-widest uppercase">
            COCOCASH RETRO
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="text-destructive font-bold text-center mb-4">
              {error}
            </div>
          )}
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
