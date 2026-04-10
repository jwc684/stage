import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { searchChunks, buildRagContext, getSourceReferences } from "@/lib/rag";
import { prisma } from "@/lib/prisma";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-20250514";

const SYSTEM_PROMPT = `당신은 STAGE 매거진의 도슨트입니다. STAGE는 한국어 디지털 매거진 및 블로그 플랫폼입니다.
방문자들이 매거진이나 블로그 콘텐츠에 대해 궁금한 것을 물어보면 친절하고 간결하게 답변해 주세요.
검색된 콘텐츠가 제공된 경우, 해당 내용을 바탕으로 정확하게 답변하세요. 출처를 언급할 수 있습니다.
검색된 콘텐츠에 관련 정보가 없는 경우, 솔직히 모른다고 말하고 일반적인 안내를 제공하세요.
항상 한국어로 답변하세요. 답변은 2-3문장으로 간결하게 해주세요.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const startTime = Date.now();

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API key가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  // RAG: retrieve relevant blog chunks
  const lastUserMsg = messages[messages.length - 1]?.content || "";
  let ragContext = "";
  let sources: { title: string; slug: string }[] = [];
  try {
    const chunks = await searchChunks(lastUserMsg, 5);
    ragContext = buildRagContext(chunks);
    sources = getSourceReferences(chunks);
  } catch (err) {
    console.error("[RAG] Search failed:", err);
  }

  const systemPrompt = `${SYSTEM_PROMPT}${ragContext}`;

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 500,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();
  let fullResponse = "";

  const readableStream = new ReadableStream({
    async start(controller) {
      let closed = false;
      function safeClose() {
        if (!closed) {
          closed = true;
          controller.close();
        }
      }

      // Send sources first as a special event
      if (sources.length > 0) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ sources })}\n\n`
          )
        );
      }

      stream.on("text", (text) => {
        fullResponse += text;
        if (!closed) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(text)}\n\n`));
        }
      });
      stream.on("end", async () => {
        if (!closed) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        }
        safeClose();

        // Log the API call
        try {
          const finalMessage = await stream.finalMessage();
          await prisma.apiCallLog.create({
            data: {
              model: MODEL,
              userMessage: lastUserMsg,
              response: fullResponse,
              sourceCount: sources.length,
              tokensIn: finalMessage.usage?.input_tokens ?? 0,
              tokensOut: finalMessage.usage?.output_tokens ?? 0,
              durationMs: Date.now() - startTime,
              status: "success",
            },
          });
        } catch (err) {
          console.error("[LOG] Failed to save API call log:", err);
        }
      });
      stream.on("error", async (err) => {
        if (!closed) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`)
          );
        }
        safeClose();

        // Log the error
        try {
          await prisma.apiCallLog.create({
            data: {
              model: MODEL,
              userMessage: lastUserMsg,
              response: fullResponse,
              sourceCount: sources.length,
              durationMs: Date.now() - startTime,
              status: "error",
              error: String(err),
            },
          });
        } catch (logErr) {
          console.error("[LOG] Failed to save error log:", logErr);
        }
      });
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
