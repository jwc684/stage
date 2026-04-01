import "dotenv/config";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
});

async function seed() {
  const client = await pool.connect();

  try {
    // Clean existing data
    await client.query("DELETE FROM \"MagazineTocEntry\"");
    await client.query("DELETE FROM \"MagazinePage\"");
    await client.query("DELETE FROM \"Magazine\"");
    await client.query("DELETE FROM \"BlogPost\"");

    console.log("Cleared existing data.");

    // Insert Magazines
    const magazines = [
      {
        id: "mag_001",
        issueNumber: 1,
        title: "STAGE 창간호",
        description: "STAGE 매거진의 첫 번째 이슈입니다.",
        status: "published",
        coverImageUrl: "https://picsum.photos/seed/stage1/600/800",
        publishedAt: "2025-01-15T00:00:00Z",
      },
      {
        id: "mag_002",
        issueNumber: 2,
        title: "STAGE Vol.2 — 봄의 시작",
        description: "봄을 맞이하는 특별한 이야기들.",
        status: "published",
        coverImageUrl: "https://picsum.photos/seed/stage2/600/800",
        publishedAt: "2025-04-01T00:00:00Z",
      },
      {
        id: "mag_003",
        issueNumber: 3,
        title: "STAGE Vol.3 — 여름 특집",
        description: "뜨거운 여름, 시원한 이야기.",
        status: "published",
        coverImageUrl: "https://picsum.photos/seed/stage3/600/800",
        publishedAt: "2025-07-01T00:00:00Z",
      },
      {
        id: "mag_004",
        issueNumber: 4,
        title: "STAGE Vol.4 — 가을 산책",
        description: "가을 감성을 담은 네 번째 호.",
        status: "published",
        coverImageUrl: "https://picsum.photos/seed/stage4/600/800",
        publishedAt: "2025-10-01T00:00:00Z",
      },
      {
        id: "mag_005",
        issueNumber: 5,
        title: "STAGE Vol.5 — 겨울 이야기",
        description: "따뜻한 겨울 이야기를 준비 중입니다.",
        status: "draft",
        coverImageUrl: "https://picsum.photos/seed/stage5/600/800",
        publishedAt: null,
      },
    ];

    for (const mag of magazines) {
      await client.query(
        `INSERT INTO "Magazine" (id, "issueNumber", title, description, status, "coverImageUrl", "publishedAt", "createdAt", "updatedAt", "viewCount")
         VALUES ($1, $2, $3, $4, $5::"MagazineStatus", $6, $7, NOW(), NOW(), $8)`,
        [
          mag.id,
          mag.issueNumber,
          mag.title,
          mag.description,
          mag.status,
          mag.coverImageUrl,
          mag.publishedAt,
          Math.floor(Math.random() * 500),
        ]
      );
    }
    console.log(`Inserted ${magazines.length} magazines.`);

    // Insert Magazine Pages (for published magazines)
    const publishedMags = magazines.filter((m) => m.status === "published");
    let pageCount = 0;
    for (const mag of publishedMags) {
      const numPages = 5 + Math.floor(Math.random() * 6); // 5-10 pages
      for (let i = 0; i < numPages; i++) {
        await client.query(
          `INSERT INTO "MagazinePage" (id, "magazineId", "pageNumber", "imageUrl", "sortOrder", "createdAt")
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [
            `page_${mag.id}_${i}`,
            mag.id,
            i + 1,
            `https://picsum.photos/seed/${mag.id}_p${i}/600/800`,
            i,
          ]
        );
        pageCount++;
      }
    }
    console.log(`Inserted ${pageCount} magazine pages.`);

    // Insert TOC entries
    let tocCount = 0;
    for (const mag of publishedMags) {
      const tocEntries = [
        { title: "에디터 노트", pageNumber: 1 },
        { title: "커버 스토리", pageNumber: 2 },
        { title: "인터뷰", pageNumber: 4 },
      ];
      for (let i = 0; i < tocEntries.length; i++) {
        await client.query(
          `INSERT INTO "MagazineTocEntry" (id, "magazineId", title, "pageNumber", "sortOrder", "createdAt")
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [
            `toc_${mag.id}_${i}`,
            mag.id,
            tocEntries[i].title,
            tocEntries[i].pageNumber,
            i,
          ]
        );
        tocCount++;
      }
    }
    console.log(`Inserted ${tocCount} TOC entries.`);

    // Insert Blog Posts
    const blogPosts = [
      {
        id: "blog_001",
        title: "STAGE를 시작하며",
        slug: "hello-stage",
        content:
          "<h2>안녕하세요, STAGE입니다</h2><p>STAGE는 문화와 예술을 담는 디지털 매거진입니다. 다양한 분야의 이야기를 전해드리겠습니다.</p><p>앞으로 많은 관심 부탁드립니다.</p>",
        thumbnailUrl: "https://picsum.photos/seed/blog1/800/400",
        author: "편집팀",
        tags: ["소식", "인사"],
        status: "published",
        publishedAt: "2025-01-10T00:00:00Z",
      },
      {
        id: "blog_002",
        title: "2025년 상반기 결산",
        slug: "2025-first-half-review",
        content:
          "<h2>2025년 상반기를 돌아보며</h2><p>올해 상반기 동안 STAGE가 걸어온 길을 정리했습니다.</p><ul><li>창간호 발행</li><li>구독자 1,000명 돌파</li><li>블로그 오픈</li></ul><p>하반기에도 좋은 콘텐츠로 찾아뵙겠습니다.</p>",
        thumbnailUrl: "https://picsum.photos/seed/blog2/800/400",
        author: "편집팀",
        tags: ["결산", "소식"],
        status: "published",
        publishedAt: "2025-06-30T00:00:00Z",
      },
      {
        id: "blog_003",
        title: "가을 추천 도서 5선",
        slug: "autumn-book-recommendations",
        content:
          "<h2>가을에 읽기 좋은 책</h2><p>선선한 바람이 부는 가을, 함께 읽고 싶은 책을 소개합니다.</p><ol><li><strong>나미야 잡화점의 기적</strong> - 히가시노 게이고</li><li><strong>어린 왕자</strong> - 생텍쥐페리</li><li><strong>데미안</strong> - 헤르만 헤세</li><li><strong>노르웨이의 숲</strong> - 무라카미 하루키</li><li><strong>연금술사</strong> - 파울루 코엘류</li></ol>",
        thumbnailUrl: "https://picsum.photos/seed/blog3/800/400",
        author: "김민지",
        tags: ["추천", "도서", "가을"],
        status: "published",
        publishedAt: "2025-10-15T00:00:00Z",
      },
      {
        id: "blog_004",
        title: "인터뷰: 신진 아티스트 이수현",
        slug: "interview-lee-suhyun",
        content:
          "<h2>이수현 작가와의 대화</h2><p>젊은 시각으로 세상을 바라보는 이수현 작가를 만났습니다.</p><blockquote>\"예술은 일상에서 시작됩니다. 특별한 것이 아니라, 평범한 것을 다르게 보는 눈이죠.\"</blockquote><p>작가의 작업실에서 나눈 이야기를 전합니다.</p>",
        thumbnailUrl: "https://picsum.photos/seed/blog4/800/400",
        author: "박서준",
        tags: ["인터뷰", "아티스트"],
        status: "published",
        publishedAt: "2025-11-20T00:00:00Z",
      },
      {
        id: "blog_005",
        title: "2026년 봄호 미리보기 (초안)",
        slug: "2026-spring-preview",
        content:
          "<h2>2026년 봄호 준비 중</h2><p>새로운 봄호의 컨셉과 콘텐츠를 준비하고 있습니다. 곧 공개하겠습니다.</p>",
        thumbnailUrl: null,
        author: "편집팀",
        tags: ["미리보기"],
        status: "draft",
        publishedAt: null,
      },
    ];

    for (const post of blogPosts) {
      await client.query(
        `INSERT INTO "BlogPost" (id, title, slug, content, "thumbnailUrl", author, tags, status, "publishedAt", "createdAt", "updatedAt", "viewCount")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::"BlogPostStatus", $9, NOW(), NOW(), $10)`,
        [
          post.id,
          post.title,
          post.slug,
          post.content,
          post.thumbnailUrl,
          post.author,
          post.tags,
          post.status,
          post.publishedAt,
          Math.floor(Math.random() * 300),
        ]
      );
    }
    console.log(`Inserted ${blogPosts.length} blog posts.`);

    console.log("\nSeed completed successfully!");
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
