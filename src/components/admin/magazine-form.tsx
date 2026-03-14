"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type FormState = { error?: string; success?: boolean } | undefined;

export function MagazineForm({
  action,
  defaultValues,
  submitLabel = "저장",
  formId,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  defaultValues?: { issueNumber?: number; title?: string; publishedAt?: Date | null };
  submitLabel?: string;
  formId?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success("저장되었습니다");
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>매거진 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <form id={formId} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issueNumber">호수</Label>
            <Input
              id="issueNumber"
              name="issueNumber"
              type="number"
              min={1}
              defaultValue={defaultValues?.issueNumber}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              defaultValue={defaultValues?.title}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publishedAt">발행날짜</Label>
            <Input
              id="publishedAt"
              name="publishedAt"
              type="date"
              defaultValue={
                defaultValues?.publishedAt
                  ? new Date(defaultValues.publishedAt)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
            />
            <p className="text-xs text-gray-500">
              비워두면 발행 시 현재 날짜가 사용됩니다
            </p>
          </div>
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "저장 중..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
