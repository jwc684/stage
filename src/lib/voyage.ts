const VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings";
const MODEL = "voyage-3";

async function callVoyageAPI(
  input: string[],
  inputType: "document" | "query"
): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) throw new Error("VOYAGE_API_KEY가 설정되지 않았습니다.");

  const body = { input, model: MODEL, input_type: inputType };

  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(VOYAGE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const json = await res.json();
      return json.data.map((d: { embedding: number[] }) => d.embedding);
    }

    if ((res.status === 429 || res.status >= 500) && attempt === 0) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    throw new Error(`Voyage API error: ${res.status} ${await res.text()}`);
  }

  throw new Error("Voyage API: max retries exceeded");
}

export async function embedDocuments(texts: string[]): Promise<number[][]> {
  return callVoyageAPI(texts, "document");
}

export async function embedQuery(text: string): Promise<number[]> {
  const [embedding] = await callVoyageAPI([text], "query");
  return embedding;
}
