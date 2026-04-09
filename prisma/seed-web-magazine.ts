import "dotenv/config";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
});

async function seed() {
  const client = await pool.connect();

  try {
    const magazineId = "mag_039";

    // Delete existing test data
    await client.query(`DELETE FROM "MagazineArticle" WHERE "magazineId" = $1`, [magazineId]);
    await client.query(`DELETE FROM "Magazine" WHERE id = $1`, [magazineId]);

    // Create web-based magazine (Issue 39)
    await client.query(
      `INSERT INTO "Magazine" (id, "issueNumber", title, description, status, "contentType", "coverImageUrl", "publishedAt", "createdAt", "updatedAt", "viewCount")
       VALUES ($1, $2, $3, $4, $5::"MagazineStatus", $6::"MagazineContentType", $7, $8, NOW(), NOW(), 0)`,
      [
        magazineId,
        39,
        "STAGE Vol.39 — 봄, 다시 시작",
        "2026년 봄, 새로운 시작을 알리는 STAGE 39호. 웹 기반 매거진의 첫 번째 호입니다.",
        "published",
        "web",
        "https://picsum.photos/seed/stage39/600/800",
        "2026-03-01T00:00:00Z",
      ]
    );
    console.log("Created web magazine: Issue 39");

    // Insert articles
    const articles = [
      {
        id: "art_039_01",
        title: "에디터스 노트: 새로운 출발",
        slug: "editors-note",
        content: `<h2>독자 여러분께</h2><p>STAGE가 새로운 모습으로 찾아왔습니다. 39호부터는 웹 기반 매거진으로 전환하여, 더 풍부하고 접근성 높은 콘텐츠를 제공합니다.</p><p>이번 호에서는 봄을 맞아 '새로운 시작'이라는 주제로 다양한 이야기를 담았습니다. 변화를 두려워하지 않는 아티스트들, 도시의 봄 풍경, 그리고 우리 모두의 이야기를 만나보세요.</p><blockquote>변화는 끝이 아니라, 새로운 시작입니다.</blockquote>`,
        author: "편집팀",
        section: "에디터스 노트",
        thumbnailUrl: "https://picsum.photos/seed/art39_01/800/600",
        sortOrder: 0,
        isCoverStory: false,
      },
      {
        id: "art_039_02",
        title: "커버스토리: 봄의 건축 — 자연과 공간의 대화",
        slug: "cover-story-spring-architecture",
        content: `<h2>자연이 건축을 만날 때</h2><p>서울 북촌에 위치한 새로운 문화 공간 '봄재'는 전통 한옥의 구조를 현대적으로 재해석한 건축물입니다. 건축가 이정환은 "건물이 자연의 일부가 되어야 한다"는 철학으로 이 공간을 설계했습니다.</p><h2>빛과 그림자의 시학</h2><p>봄재의 가장 큰 특징은 계절에 따라 변하는 자연광의 활용입니다. 봄이 되면 건물 내부에 벚꽃 그림자가 드리워지고, 여름에는 처마가 만드는 깊은 그늘이 시원함을 선사합니다.</p><p>이정환 건축가는 말합니다: "좋은 건축은 시간을 담는 그릇이어야 합니다. 봄재는 봄의 기억을 간직하는 공간이죠."</p>`,
        author: "김서연",
        section: "커버 스토리",
        thumbnailUrl: "https://picsum.photos/seed/art39_02/800/600",
        sortOrder: 1,
        isCoverStory: true,
      },
      {
        id: "art_039_03",
        title: "인터뷰: 조각가 박민수 — 손끝에서 피어나는 형상",
        slug: "interview-park-minsu",
        content: `<h2>만남</h2><p>서울 성수동의 한 작업실. 조각가 박민수는 나무 조각을 다듬고 있었습니다. 그의 작품은 자연의 형태를 추상적으로 재해석한 것으로, 국내외에서 주목받고 있습니다.</p><h2>작업에 대하여</h2><p><strong>Q. 조각을 시작하게 된 계기는?</strong></p><p>"어린 시절 할아버지가 나무를 깎는 모습을 보며 자랐어요. 나무에는 이미 형태가 숨어 있고, 저는 그것을 꺼내는 역할을 할 뿐입니다."</p><p><strong>Q. 최근 작품의 주제는?</strong></p><p>"'기억의 지층'이라는 시리즈를 작업하고 있어요. 시간이 쌓이면서 만들어지는 형태, 마치 지질학적 단층처럼 켜켜이 쌓인 기억들을 표현하고 있습니다."</p>`,
        author: "박서준",
        section: "인터뷰",
        thumbnailUrl: "https://picsum.photos/seed/art39_03/800/600",
        sortOrder: 2,
        isCoverStory: false,
      },
      {
        id: "art_039_04",
        title: "도시 산책: 서울의 숨겨진 봄 명소 7곳",
        slug: "seoul-spring-spots",
        content: `<h2>도시 속 봄을 찾아서</h2><p>화려한 벚꽃 명소 대신, 조용히 봄을 느낄 수 있는 서울의 숨겨진 장소들을 소개합니다.</p><ol><li><strong>성북동 심우장</strong> — 만해 한용운이 살았던 곳. 봄이면 매화가 핍니다.</li><li><strong>부암동 백석동천</strong> — 인왕산 자락의 계곡. 야생화가 피어나는 산책로.</li><li><strong>세검정 수문</strong> — 조선 시대 수문 옆, 물소리와 함께하는 봄.</li><li><strong>창경궁 대온실</strong> — 1909년에 지어진 동양 최초의 서양식 온실.</li><li><strong>선유도공원</strong> — 옛 정수장이 공원이 된 곳. 수생식물이 깨어나는 봄이 특히 아름답습니다.</li><li><strong>이화동 벽화마을</strong> — 골목 사이로 피어나는 봄꽃들.</li><li><strong>서촌 통인시장</strong> — 봄 나물과 함께하는 시장 산책.</li></ol>`,
        author: "이하늘",
        section: "칼럼",
        thumbnailUrl: "https://picsum.photos/seed/art39_04/800/600",
        sortOrder: 3,
        isCoverStory: false,
      },
      {
        id: "art_039_05",
        title: "에세이: 계절의 문턱에서",
        slug: "essay-threshold-of-seasons",
        content: `<p>봄이 오는 순간을 정확히 알 수 있는 사람이 있을까. 겨울의 끝과 봄의 시작 사이에는 명확한 경계가 없다. 그저 어느 날 문득 공기가 달라졌음을 깨닫는 것이다.</p><p>올해의 봄은 유독 조용히 왔다. 아직 코트를 입고 다니던 어느 아침, 출근길 가로수에서 연두색 새순이 돋아나 있는 것을 발견했다. 그 작은 잎사귀 하나가 계절이 바뀌었음을 알려주었다.</p><p>우리의 삶도 그런 것이 아닐까. 큰 변화는 항상 작은 신호에서 시작된다. 중요한 것은 그 신호를 알아차리는 감각을 잃지 않는 것이다.</p>`,
        author: "정유진",
        section: "에세이",
        thumbnailUrl: "https://picsum.photos/seed/art39_05/800/600",
        sortOrder: 4,
        isCoverStory: false,
      },
    ];

    for (const art of articles) {
      await client.query(
        `INSERT INTO "MagazineArticle" (id, "magazineId", title, slug, content, author, section, "thumbnailUrl", "sortOrder", "isCoverStory", status, "publishedAt", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::"BlogPostStatus", $12, NOW(), NOW())`,
        [
          art.id,
          magazineId,
          art.title,
          art.slug,
          art.content,
          art.author,
          art.section,
          art.thumbnailUrl,
          art.sortOrder,
          art.isCoverStory,
          "published",
          "2026-03-01T00:00:00Z",
        ]
      );
    }
    console.log(`Inserted ${articles.length} articles for Issue 39`);
    console.log("\nSeed completed!");
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
