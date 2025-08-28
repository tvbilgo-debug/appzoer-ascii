"use client";

import { useSession } from "next-auth/react";
import { Coins } from "lucide-react";
import { Badge } from "./badge";

export function CreditDisplay() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  // For now, we'll show a default of 10 credits
  // In a real implementation, this would come from the user's profile
  const credits = 10; // This should be fetched from the user's data

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <Coins className="h-3 w-3" />
      <span className="text-xs font-mono">{credits} credits</span>
    </Badge>
  );
}
