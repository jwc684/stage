"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ApiLog {
  id: string;
  model: string;
  userMessage: string;
  response: string;
  sourceCount: number;
  tokensIn: number;
  tokensOut: number;
  durationMs: number;
  status: string;
  error: string | null;
  createdAt: Date;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + "…" : str;
}

export function ApiLogsTable({ logs }: { logs: ApiLog[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (logs.length === 0) {
    return (
      <p className="py-12 text-center text-gray-400">
        API 호출 기록이 없습니다.
      </p>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-36">시간</TableHead>
              <TableHead>사용자 메시지</TableHead>
              <TableHead className="w-20">상태</TableHead>
              <TableHead className="w-20">소스</TableHead>
              <TableHead className="w-28">토큰 (IN/OUT)</TableHead>
              <TableHead className="w-20">소요시간</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow
                key={log.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  setExpandedId(expandedId === log.id ? null : log.id)
                }
              >
                <TableCell className="text-xs text-gray-500">
                  {formatDate(log.createdAt)}
                </TableCell>
                <TableCell className="text-sm">
                  {truncate(log.userMessage, 50)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={log.status === "success" ? "default" : "destructive"}
                  >
                    {log.status === "success" ? "성공" : "오류"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {log.sourceCount}건
                </TableCell>
                <TableCell className="text-xs text-gray-500">
                  {log.tokensIn} / {log.tokensOut}
                </TableCell>
                <TableCell className="text-xs text-gray-500">
                  {(log.durationMs / 1000).toFixed(1)}s
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Expanded detail */}
        {expandedId && (() => {
          const log = logs.find((l) => l.id === expandedId);
          if (!log) return null;
          return (
            <div className="mt-4 rounded-lg border bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">상세 정보</h3>
                <button
                  onClick={() => setExpandedId(null)}
                  className="text-sm text-gray-400 hover:text-gray-600"
                >
                  닫기
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">모델:</span>{" "}
                  <span className="font-mono text-xs">{log.model}</span>
                </div>
                <div>
                  <span className="text-gray-500">소요시간:</span>{" "}
                  {(log.durationMs / 1000).toFixed(2)}초
                </div>
                <div>
                  <span className="text-gray-500">입력 토큰:</span>{" "}
                  {log.tokensIn.toLocaleString()}
                </div>
                <div>
                  <span className="text-gray-500">출력 토큰:</span>{" "}
                  {log.tokensOut.toLocaleString()}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">사용자 메시지</p>
                <div className="rounded bg-gray-50 p-3 text-sm">
                  {log.userMessage}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">AI 응답</p>
                <div className="rounded bg-gray-50 p-3 text-sm whitespace-pre-wrap">
                  {log.response}
                </div>
              </div>
              {log.error && (
                <div>
                  <p className="text-sm text-red-500 mb-1">오류</p>
                  <div className="rounded bg-red-50 p-3 text-sm text-red-700">
                    {log.error}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-lg border bg-white p-4"
            onClick={() =>
              setExpandedId(expandedId === log.id ? null : log.id)
            }
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">
                {formatDate(log.createdAt)}
              </span>
              <Badge
                variant={log.status === "success" ? "default" : "destructive"}
              >
                {log.status === "success" ? "성공" : "오류"}
              </Badge>
            </div>
            <p className="text-sm mb-2">{truncate(log.userMessage, 60)}</p>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>소스 {log.sourceCount}건</span>
              <span>토큰 {log.tokensIn}/{log.tokensOut}</span>
              <span>{(log.durationMs / 1000).toFixed(1)}s</span>
            </div>

            {expandedId === log.id && (
              <div className="mt-3 pt-3 border-t space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">AI 응답</p>
                  <div className="rounded bg-gray-50 p-2 text-xs whitespace-pre-wrap">
                    {log.response}
                  </div>
                </div>
                {log.error && (
                  <div>
                    <p className="text-xs text-red-500 mb-1">오류</p>
                    <div className="rounded bg-red-50 p-2 text-xs text-red-700">
                      {log.error}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
