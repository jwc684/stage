# STAGE 플랫폼 개발 문서
**FINAL VERSION**

문화예술 매거진 STAGE 디지털 플랫폼 구축을 위한 개발자 전달용 최종 명세서

- **문서 목적**: 개발자가 추가 해석 없이 바로 설계, 개발, 배포를 시작할 수 있도록 서비스 구조, IA, UX, CMS, 데이터 모델, API, 운영 권한, 저장소 전략, 도슨트 아키텍처를 상세 정의한다.
- **프로젝트 성격**: 문화예술 디지털 매거진 + 과월호 아카이브 + Artists 네트워크 + STAGE 도슨트
- **개발 권장 스택**: Next.js + Headless CMS(Sanity 또는 Strapi) + PostgreSQL + Meilisearch + S3-compatible Object Storage + Render
- **1차 개발 범위**: 메인, 아카이브, 기사, 이슈, 아티스트, 문의, CMS, 기본 도슨트
- **브랜드 원칙**: 사용자 화면에서는 AI를 전면에 내세우지 않고 STAGE 도슨트로 표현
- **문서 성격**: MVP 개발 착수용 마스터 스펙

---

## 1. Product Overview

STAGE는 단순한 웹사이트가 아니라, 아래 네 가지 층위를 동시에 갖는 문화예술 플랫폼이다.

- **Digital Magazine**: 39호 이후 기사 단위로 발행되는 HTML 기반 웹 매거진
- **Archive Platform**: 1~38호 과월호를 자산화하는 잡지목록과 뷰어 구조
- **Artists Network**: STAGE가 조명한 인물의 소개와 강연 및 공연 문의 연결 구조
- **STAGE Docent**: 기사와 아카이브를 바탕으로 문화예술 맥락을 정리해 주는 탐색 기능

### 1.1 프로젝트 목표

1. 1~38호를 커버 그리드 기반 아카이브로 안정적으로 열람 가능하게 구성한다.
2. 39호 이후는 HTML 기사 중심으로 운영하여 SEO 유입을 확보한다.
3. 매거진 톤을 해치지 않으면서 STAGE 도슨트를 핵심 차별 기능으로 도입한다.
4. 향후 아티스트 네트워크와 문화 프로그램 연계가 가능한 구조를 확보한다.

### 1.2 브랜드 및 UX 원칙

- 브랜드 표기는 **문화예술 매거진 STAGE**를 기본으로 한다.
- 기술은 내부적으로 활용하되 사용자 인터페이스에서는 AI 표현을 과도하게 전면화하지 않는다.
- 도슨트는 답을 단정적으로 선언하는 도구가 아니라 맥락을 함께 정리해 주는 안내자 톤으로 표현한다.
- 전체 사이트의 인상은 권위감, 가독성, 고급스러운 여백을 우선한다.

---

## 2. Recommended System Architecture

권장 아키텍처는 프론트엔드와 CMS를 분리한 헤드리스 구조이며, 저장소는 특정 벤더에 종속되지 않는 S3-compatible object storage를 사용한다.

| 영역 | 권장안 | 비고 |
|---|---|---|
| Frontend | Next.js | SSR 및 SSG 혼합, SEO와 편집형 콘텐츠에 적합 |
| CMS | Sanity 또는 Strapi | 편집부 운영, 콘텐츠 모델 설계 용이 |
| Database | PostgreSQL | 정형 데이터와 관리 기능에 안정적 |
| Search | Meilisearch | 기사 및 아카이브 검색용, 초기 구축 단순 |
| Storage | S3-compatible Object Storage | 예: R2, S3, Backblaze B2, Wasabi |
| Hosting | Render 또는 유사 PaaS | 배포와 운영 단순화 |
| Docent | LLM + RAG | 기사, 아카이브, 인물 데이터를 기반으로 응답 |

### 2.1 논리 아키텍처 흐름

```text
User -> Next.js Frontend -> API Layer
API Layer -> Headless CMS 및 PostgreSQL
API Layer -> Search Engine
API Layer -> Object Storage(PDF, cover, page images)
Docent Query -> Retrieval Layer -> Vector Store -> LLM -> Answer + Evidence Links
```

---

## 3. Information Architecture and Routing

| Route | 설명 |
|---|---|
| `/` | 메인 페이지 |
| `/magazine` | 잡지목록(과월호 아카이브) |
| `/issue/vol-XX` | 개별 호 랜딩 페이지 |
| `/issue/vol-XX/view` | 뷰어 페이지(PDF 또는 페이지 이미지 뷰어) |
| `/article/{slug}` | 기사 상세 페이지 |
| `/category/{slug}` | 카테고리 목록 |
| `/artists` | STAGE Artists 목록 |
| `/artists/{slug}` | 아티스트 상세 |
| `/docent` | STAGE 도슨트 |
| `/inquiry/artist` | 강연 및 공연 문의 |

---

## 4. Main Page UX Structure

메인 페이지는 매거진 브랜드를 중심에 두고, 도슨트를 강하게 노출하되 기술적 냄새가 나지 않도록 설계한다.

- Cover Story Hero
- STAGE 도슨트 Hero
- Featured Articles 3개
- Latest Articles
- Category Sections
- Monthly Issue Highlight
- STAGE Artists Highlight
- Footer

### 4.1 Cover Story Hero

**필수 데이터**

- `coverStoryArticleId`
- `title`
- `deck`
- `heroImage`
- `categoryLabel`
- `author`
- `publishedAt`

**구성**

- 대형 이미지
- 제목
- 2-3줄 deck
- 작성자와 카테고리 표시
- 클릭 시 기사 상세 페이지로 이동

### 4.2 STAGE 도슨트 Hero

- **타이틀 예시**: STAGE 도슨트
- **설명 예시**: 매거진과 아카이브를 바탕으로 작품과 예술가의 맥락을 정리합니다.
- **구성 요소**: 질문 입력창, 예시 질문 3-5개, 대화 시작 버튼
- **원칙**: AI라는 단어는 메인 전면 카피에서 사용하지 않는다.

### 4.3 Featured / Latest / Category Sections

- **Featured Articles**: 수동 큐레이션 3개
- **Latest Articles**: 최신 기사 6-8개 자동 노출
- **Category Sections**: Opera, Music, Dance, Global, Interview, Column 등 주요 카테고리별 4개 기사
- 각 섹션에는 전체보기 링크를 포함한다.

### 4.4 Monthly Issue Highlight / STAGE Artists

- 최신호는 크게 노출하고 과월호 4-8개를 커버 그리드로 함께 배치한다.
- STAGE Artists 블록은 대표 인물 4-6명을 노출하고 전체 목록으로 유도한다.
- Artists 목록에서는 상업성이 과해 보이지 않도록 직접적인 문의 CTA를 최소화한다.

---

## 5. Page Templates

### 5.1 Magazine Archive (`/magazine`)

- **목적**: 1~38호 및 이후 발행호를 커버 썸네일 중심으로 모아 보여주는 잡지목록 페이지
- **레이아웃**: 데스크탑 3열, 태블릿 2열, 모바일 1-2열
- **카드 데이터**: `volNo`, 발행월, `coverImage`, 선택적으로 1줄 소개
- **카드 클릭 시**: `/issue/vol-XX` 이동
- **권장 기능**: 연도 필터, vol 검색, 페이지네이션

### 5.2 Issue Landing (`/issue/vol-XX`)

**필수 데이터**

- `volNo`
- `slug`
- `publishDate`
- `coverImage`
- `introText`
- `viewerType`
- `pdfFile`
- `pageImages`

**CTA**

- CTA 1: 보기 -> `/issue/vol-XX/view`
- CTA 2: PDF 다운로드(정책에 따라 노출)

**기타**

- Vol39 이후는 해당 이슈에 연결된 기사 리스트를 노출할 수 있다.
- 이전 및 다음 호 네비게이션 포함

### 5.3 Viewer (`/issue/vol-XX/view`)

- `viewerType`은 `pdf` 또는 `pages` 중 하나 이상 지원
- `pages` 방식은 웹 열람 최적화를 위해 WebP 이미지 시퀀스로 제공
- **필수 기능**: 페이지 이동, 확대 및 축소, 전체화면, 공유
- 초기 MVP는 PDF viewer 우선, 페이지 이미지 뷰어는 2차 또는 병행 구현 가능

### 5.4 Article Detail (`/article/{slug}`)

**필수 데이터**

- `title`
- `slug`
- `deck`
- `content`
- `heroImage`
- `category`
- `tags`
- `author`
- `publishDate`
- `issueReference`

**레이아웃**

카테고리 -> 제목 -> deck -> 본문 -> 해당 issue -> 관련 기사

**SEO 메타**

- `metaTitle`
- `metaDescription`
- `ogImage`
- `canonical`

### 5.5 Artists / Artist Detail

- `/artists`: 카드형 목록, 역할 필터 선택 가능
- `/artists/{slug}`: 프로필, 약력, 관련 기사, 강연 및 공연 문의 CTA
- 강연 및 공연 문의는 상세 페이지에서만 명확히 노출하는 것을 권장

### 5.6 Inquiry (`/inquiry/artist`)

**필드**

- 기관명
- 담당자명
- 이메일
- 연락처
- 요청 유형
- 일정
- 예산 범위
- 요청 내용
- 개인정보 동의

**동작**

- 전송 후 관리자 이메일 발송 및 데이터 저장

**문의 상태값**

- `New`
- `In Progress`
- `Completed`

---

## 6. CMS Design

CMS는 편집부가 개발자 도움 없이 운영 가능한 수준으로 설계한다. 초기에는 복잡한 역할 분리보다 간결한 메뉴와 명확한 워크플로우가 중요하다.

- Dashboard
- Articles
- Issues
- Artists
- Categories
- Tags
- Home Curation
- Inquiries
- Docent Console
- Media Library
- Users
- Settings

### 6.1 Dashboard

- 발행 예정 기사
- 검수 대기 기사
- 최근 발행 기사
- 문의 건수
- 선택: 인기 콘텐츠, 도슨트 인기 질문

### 6.2 Editorial Workflow

- Writer: 초안 작성(`Draft`)
- Editor: 검수(`Review`) 및 수정 요청
- Admin 또는 Editor: 승인 후 `Published`
- 예약 발행이 필요한 경우 `publishAt` 필드 사용

---

## 7. Content Models

### 7.1 Article Model

| 필드 | 설명 |
|---|---|
| `title` | 기사 제목 |
| `slug` | URL용 고유 문자열 |
| `deck` | 2-3줄 리드 |
| `content` | 본문 |
| `heroImage` | 대표 이미지 |
| `category` | 단일 카테고리 |
| `tags` | 복수 태그 |
| `author` | 작성자 |
| `publishDate` | 발행일 |
| `issueReference` | 연결된 이슈 |
| `status` | `Draft / Review / Published` |
| `metaTitle` | SEO 제목 |
| `metaDescription` | SEO 설명 |
| `ogImage` | 공유 썸네일 |

### 7.2 Issue Model

| 필드 | 설명 |
|---|---|
| `volNumber` | 호수 |
| `slug` | 예: `vol-38` |
| `issueTitle` | 예: `STAGE Vol.38` |
| `publishDate` | 발행일 |
| `coverImage` | 커버 |
| `introText` | 소개 글 |
| `viewerType` | `pdf / pages` |
| `pdfFile` | 원본 PDF |
| `pageImages` | 웹 뷰어용 이미지 목록 |
| `downloadEnabled` | 다운로드 허용 여부 |
| `previousIssue` | 이전 호 참조 |
| `nextIssue` | 다음 호 참조 |

### 7.3 Artist Model

| 필드 | 설명 |
|---|---|
| `name` | 이름 |
| `slug` | URL용 고유 문자열 |
| `role` | 지휘자, 성악가, 평론가 등 |
| `profileImage` | 프로필 이미지 |
| `shortIntro` | 한 줄 소개 |
| `bio` | 약력 |
| `topics` | 강연 및 공연 키워드 |
| `relatedArticles` | 연결 기사 |
| `bookingEnabled` | 문의 기능 활성 여부 |

### 7.4 Home Curation Model

- `coverStoryArticleId`
- `featuredArticles[3]`
- `latestArticlesCount`
- `categoryBlocksConfig`
- `latestIssueId`
- `previousIssuesCount`
- `featuredArtists[]`
- `docentPromptExamples[]`

---

## 8. Roles and Permissions

초기 운영 기준으로 권한은 간소화한다. 1차는 3개 역할만 사용한다.

| 역할 | 주요 권한 | 발행 가능 여부 | 비고 |
|---|---|---|---|
| Admin | 전체 관리, 승인, 큐레이션, 사용자 관리, 도슨트 운영 | 가능 | 최상위 운영자 |
| Editor | 기사, Issue, Artist 관리 및 검수 | 가능 | 편집부 주 운영자 |
| Writer | 본인 기사 작성 및 수정 | 불가 | 기고자/외부 필자용 |

---

## 9. Database Schema (Concept)

- `articles`
- `issues`
- `artists`
- `categories`
- `tags`
- `users`
- `inquiries`
- `home_curation`
- `docent_logs`

### 9.1 주요 관계

- Article `N:1` Category
- Article `N:M` Tags
- Article `N:1` Issue(선택)
- Artist `N:M` Article
- Home Curation `1:1` Site
- Inquiry `N:1` Artist(선택)

---

## 10. API Specification (Draft)

| Endpoint | 설명 |
|---|---|
| `GET /articles` | 기사 목록 조회 |
| `GET /articles/{slug}` | 기사 상세 조회 |
| `POST /articles` | 기사 생성 |
| `PUT /articles/{id}` | 기사 수정 |
| `DELETE /articles/{id}` | 기사 삭제 |
| `GET /issues` | 호 목록 조회 |
| `GET /issues/{vol}` | 호 상세 조회 |
| `POST /issues` | 호 생성 또는 수정 |
| `GET /artists` | 아티스트 목록 |
| `GET /artists/{slug}` | 아티스트 상세 |
| `POST /inquiry` | 문의 접수 |
| `GET /docent/query` | 도슨트 질의 |

---

## 11. Archive and Storage Policy

저장소는 특정 벤더로 고정하지 않는다. 반드시 S3-compatible object storage를 지원하도록 설계하여 비용 및 운영 상황에 따라 공급자를 선택할 수 있게 한다.

- 지원 예시: Cloudflare R2, AWS S3, Backblaze B2, Wasabi
- 원본 PDF는 보관 및 다운로드용 정본으로 유지한다.
- 웹 뷰어용 페이지 이미지는 WebP로 변환하여 별도 저장한다.
- 커버 이미지는 `cover.webp` 형태로 표준화한다.

### 11.1 권장 폴더 구조

```text
/issues/vol38/
    cover.webp
    stage38.pdf
    pages/001.webp
    pages/002.webp
    pages/003.webp
```

### 11.2 Image Pipeline

- 입력 자산: 원본 JPG 및 PDF
- 웹 뷰어용 변환: JPG -> WebP
- 다운로드 및 보관용: PDF 유지
- 결론: PDF와 이미지 둘 다 사용하되 역할을 분리한다.

---

## 12. Search Architecture

- 기사, 이슈, 아티스트에 대한 통합 검색 제공
- 초기 MVP는 제목, 요약, 태그 중심 검색
- 향후 본문 전체 검색과 필터(카테고리, 연도, 인물) 확장 가능
- 검색 엔진은 Meilisearch 권장

---

## 13. STAGE Docent Architecture

STAGE 도슨트는 사용자에게는 문화예술 안내 기능으로 보이지만, 내부적으로는 기사와 아카이브를 근거로 검색하는 RAG 구조를 사용한다.

### 13.1 Knowledge Sources

- HTML 기사 본문
- 과월호 PDF에서 추출한 텍스트 또는 페이지 설명
- Artist 프로필 및 관련 메타데이터
- 카테고리, 태그, 호수 정보

### 13.2 Retrieval Flow

1. 콘텐츠 발행 또는 수정
2. 텍스트 청크 분할
3. 임베딩 생성
4. Vector Store 저장
5. 질문 입력 시 관련 청크 검색
6. LLM이 답변 생성
7. 관련 기사 및 이슈 링크를 근거로 함께 반환

### 13.3 Docent Console 운영 기능

- 추천 질문 관리
- 질문 로그 조회
- 포함 및 제외 지식 소스 관리
- 재인덱싱 실행
- 금칙어 및 민감 주제 정책 설정

---

## 14. Next.js Project Structure (Recommended)

```text
app/
  page.tsx
  magazine/page.tsx
  issue/[slug]/page.tsx
  issue/[slug]/view/page.tsx
  article/[slug]/page.tsx
  category/[slug]/page.tsx
  artists/page.tsx
  artists/[slug]/page.tsx
  docent/page.tsx
  inquiry/artist/page.tsx

components/
  home/
  magazine/
  article/
  artist/
  docent/
  ui/

lib/
  api/
  cms/
  search/
  docent/

types/
  article.ts
  issue.ts
  artist.ts
  inquiry.ts
```

---

## 15. MVP Scope

- 메인 페이지
- Magazine 아카이브
- Issue 랜딩 및 기본 뷰어
- Article CMS 및 기사 상세
- Artists 목록 및 상세
- Inquiry 시스템
- STAGE 도슨트 기본 기능
- 기본 권한(Admin, Editor, Writer)

---

## 16. Phase 2 Expansion

- 회원 기능(북마크, 히스토리)
- 고급 검색 및 필터 확장
- 페이지 이미지 기반 고급 뷰어
- 아티스트 네트워크 확장 및 매칭 관리
- 도슨트 응답 품질 개선 및 추천 질문 자동화

---

## 17. Final Development Notes

- 사용자 화면에서는 AI 대신 도슨트를 사용한다.
- 저장소는 특정 서비스에 종속되지 않도록 S3-compatible 기준으로 구현한다.
- URL은 발행 후 바꾸지 않는 것을 원칙으로 한다.
- 편집부가 스스로 운영할 수 있는 CMS 구조를 우선한다.
