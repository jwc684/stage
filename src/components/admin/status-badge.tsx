import { Badge } from "@/components/ui/badge";

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  draft: { label: "초안", variant: "secondary" },
  published: { label: "발행됨", variant: "default" },
  unpublished: { label: "미발행", variant: "outline" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    label: status,
    variant: "outline" as const,
  };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
