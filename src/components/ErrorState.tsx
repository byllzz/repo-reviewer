import { AlertTriangle } from "lucide-react";

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center text-center gap-3 shadow-lg">
      <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
        <AlertTriangle size={18} />
      </div>
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
