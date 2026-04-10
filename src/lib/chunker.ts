import sanitizeHtml from "sanitize-html";

export interface ChunkData {
  chunkIndex: number;
  content: string;
  title: string;
}

const MAX_CHUNK_LENGTH = 800;

export function chunkBlogContent(html: string, title: string): ChunkData[] {
  if (!html || html.trim().length < 20) return [];

  // Split HTML by heading tags to get sections
  const sections = html.split(/<h[1-3][^>]*>/i).filter(Boolean);

  const rawChunks: string[] = [];

  for (const section of sections) {
    // Strip HTML tags
    const text = sanitizeHtml(section, {
      allowedTags: [],
      allowedAttributes: {},
    })
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!text || text.length < 20) continue;

    if (text.length <= MAX_CHUNK_LENGTH) {
      rawChunks.push(text);
    } else {
      // Split at paragraph/sentence boundaries
      const paragraphs = text.split(/\n\n+/);
      let current = "";

      for (const para of paragraphs) {
        if (current.length + para.length > MAX_CHUNK_LENGTH && current) {
          rawChunks.push(current.trim());
          current = para;
        } else {
          current = current ? `${current}\n\n${para}` : para;
        }
      }

      // If still too long, split at sentence boundaries
      if (current.length > MAX_CHUNK_LENGTH) {
        const sentences = current.split(/(?<=[.다요까!?])\s+/);
        let buf = "";
        for (const s of sentences) {
          if (buf.length + s.length > MAX_CHUNK_LENGTH && buf) {
            rawChunks.push(buf.trim());
            buf = s;
          } else {
            buf = buf ? `${buf} ${s}` : s;
          }
        }
        if (buf.trim()) rawChunks.push(buf.trim());
      } else if (current.trim()) {
        rawChunks.push(current.trim());
      }
    }
  }

  return rawChunks
    .filter((c) => c.length >= 20)
    .map((content, i) => ({
      chunkIndex: i,
      content: `[${title}] ${content}`,
      title,
    }));
}
