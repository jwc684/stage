export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ApiLogsTable } from "@/components/admin/api-logs-table";

export default async function AdminApiLogsPage() {
  const logs = await prisma.apiCallLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">API 호출 로그</h1>
        <p className="text-sm text-gray-500 mt-1">
          도슨트 채팅 API 호출 내역 (최근 100건)
        </p>
      </div>
      <ApiLogsTable logs={logs} />
    </div>
  );
}
