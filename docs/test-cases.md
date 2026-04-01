# STAGE Test Cases

모든 기능에 대한 테스트 케이스 문서입니다.

---

## 1. Server Actions

### 1.1 Blog Actions (`src/actions/blog-actions.ts`)

#### createBlogPost

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| BA-C01 | 정상 생성 | title="테스트", slug="test-post", author="작성자" | success: true, redirect to /admin/blog |
| BA-C02 | 제목 누락 | title="" | error: "제목을 입력해주세요" |
| BA-C03 | 제목 200자 초과 | title=201자 문자열 | error: 최대 길이 초과 |
| BA-C04 | 슬러그 누락 | slug="" | error: "슬러그를 입력해주세요" |
| BA-C05 | 슬러그 형식 오류 | slug="한글슬러그" | error: 영문 소문자/숫자/하이픈만 가능 |
| BA-C06 | 슬러그 대문자 | slug="Test-Post" | error: 형식 오류 |
| BA-C07 | 슬러그 특수문자 | slug="test_post!" | error: 형식 오류 |
| BA-C08 | 슬러그 중복 | slug=기존 포스트와 동일 | error: "이미 사용 중인 슬러그입니다" |
| BA-C09 | 태그 파싱 | tags="태그1, 태그2, 태그3" | 배열 ["태그1","태그2","태그3"] 으로 저장 |
| BA-C10 | 빈 태그 | tags="" | 빈 배열 저장 |
| BA-C11 | 발행일 설정 | publishedAt="2025-06-01" | 해당 날짜로 저장 |
| BA-C12 | 발행일 미설정 | publishedAt="" | null 저장 |
| BA-C13 | 썸네일 URL | thumbnailUrl="https://..." | URL 저장 |
| BA-C14 | 콘텐츠 HTML | content="<h2>제목</h2><p>본문</p>" | HTML 그대로 저장 |

#### updateBlogPost

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| BA-U01 | 정상 수정 | 유효한 모든 필드 | success: true, revalidatePath |
| BA-U02 | 슬러그 변경 (충돌 없음) | 새 슬러그 | 정상 업데이트 |
| BA-U03 | 슬러그 변경 (다른 포스트와 충돌) | 기존 다른 포스트 슬러그 | error: 슬러그 중복 |
| BA-U04 | 슬러그 유지 (자기 자신) | 현재 포스트와 동일 슬러그 | 정상 업데이트 (충돌 아님) |
| BA-U05 | 존재하지 않는 ID | id="nonexistent" | 에러 발생 |

#### publishBlogPost

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| BA-P01 | 초안 발행 | draft 상태 포스트 | status=published, publishedAt 설정 |
| BA-P02 | 이미 발행된 포스트 | published 상태 | 정상 처리 (publishedAt 유지) |
| BA-P03 | publishedAt 이미 있음 | 기존 publishedAt="2025-01-01" | 기존 날짜 유지 |

#### unpublishBlogPost

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| BA-UP01 | 발행 취소 | published 포스트 | status=draft |
| BA-UP02 | 이미 초안 | draft 포스트 | 정상 처리 |

#### deleteBlogPost

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| BA-D01 | 정상 삭제 | 존재하는 포스트 ID | 삭제 후 redirect /admin/blog |
| BA-D02 | 썸네일 있는 포스트 삭제 | thumbnailUrl 있는 포스트 | 파일 삭제 + DB 삭제 |
| BA-D03 | 존재하지 않는 포스트 | 잘못된 ID | 에러 처리 |

---

### 1.2 Magazine Actions (`src/actions/magazine-actions.ts`)

#### createMagazine

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| MA-C01 | 정상 생성 | issueNumber=1, title="창간호" | success, redirect /admin/magazines/[id]/edit |
| MA-C02 | 호수 누락 | issueNumber="" | error: 유효성 검사 실패 |
| MA-C03 | 호수 0 | issueNumber=0 | error: 최소값 1 |
| MA-C04 | 호수 음수 | issueNumber=-1 | error: 최소값 1 |
| MA-C05 | 호수 소수점 | issueNumber=1.5 | 정수로 coercion 또는 에러 |
| MA-C06 | 호수 중복 | 기존과 동일 issueNumber | error: 호수 중복 |
| MA-C07 | 제목 누락 | title="" | error |
| MA-C08 | 설명 없음 | description="" | null 또는 빈 문자열 저장 |
| MA-C09 | 발행일 설정 | publishedAt="2025-10-01" | 해당 날짜 저장 |

#### updateMagazine

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| MA-U01 | 정상 수정 | 유효 필드 | success |
| MA-U02 | 호수 변경 (충돌) | 다른 매거진과 동일 호수 | error: 중복 |
| MA-U03 | 호수 유지 (자기 자신) | 현재 매거진과 동일 호수 | 정상 |

#### publishMagazine

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| MA-P01 | 페이지 있는 매거진 발행 | pages >= 1 | status=published |
| MA-P02 | 페이지 없는 매거진 발행 | pages = 0 | error: "페이지가 없는 매거진은 발행할 수 없습니다" |
| MA-P03 | publishedAt 없이 발행 | publishedAt=null | 현재 날짜로 자동 설정 |
| MA-P04 | publishedAt 있으면 유지 | publishedAt="2025-01-01" | 기존 날짜 유지 |

#### unpublishMagazine

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| MA-UP01 | 발행 취소 | published 매거진 | status=unpublished |

#### deleteMagazine

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| MA-D01 | 정상 삭제 | 존재하는 매거진 | 삭제 후 redirect /admin/magazines |
| MA-D02 | 페이지 포함 삭제 | pages 있는 매거진 | Cascade 삭제 (pages + toc) |

---

### 1.3 Page Actions (`src/actions/page-actions.ts`)

#### reorderPages

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| PA-R01 | 정상 재정렬 | 유효한 orderedIds 배열 | sortOrder 업데이트 + 커버 이미지 변경 |
| PA-R02 | 단일 페이지 | 1개 ID 배열 | 정상 처리 |
| PA-R03 | 빈 배열 | [] | 에러 없이 처리 |
| PA-R04 | 커버 이미지 갱신 | 첫 번째 페이지 변경 | coverImageUrl 업데이트 |
| PA-R05 | 존재하지 않는 ID 포함 | 잘못된 ID 섞임 | 에러 또는 무시 |

#### deletePage

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| PA-D01 | 정상 삭제 | 존재하는 pageId | 페이지 삭제 + 스토리지 파일 삭제 |
| PA-D02 | 첫 번째 페이지 삭제 | 커버 이미지인 페이지 | 다음 페이지로 커버 변경 |
| PA-D03 | 마지막 페이지 삭제 | 유일한 페이지 | coverImageUrl=null |
| PA-D04 | 스토리지 삭제 실패 | 파일 없는 경우 | DB 삭제는 성공, 스토리지 에러 로그 |

#### renamePageFiles

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| PA-RN01 | 전체 파일명 일괄 변경 | magazineId | 모든 파일을 1.webp, 2.webp... 로 변경 |
| PA-RN02 | 특수문자 파일명 | 한글/이모지 포함 파일명 | 안전한 파일명으로 변환 |
| PA-RN03 | 이동 실패 시 | 스토리지 에러 | 에러 메시지 반환 |

#### renamePageFile

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| PA-RF01 | 단일 파일 이름 변경 | pageId, newName | 파일명 변경 + URL 업데이트 |
| PA-RF02 | 빈 이름 | newName="" | 에러 |
| PA-RF03 | 특수문자 제거 | newName="테스트!@#" | 안전한 문자만 유지 |

---

### 1.4 TOC Actions (`src/actions/toc-actions.ts`)

#### saveTocEntries

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| TOC-01 | 정상 저장 | 유효한 entries 배열 | 기존 삭제 후 새로 삽입 |
| TOC-02 | 빈 배열 | [] | 기존 TOC 전체 삭제 |
| TOC-03 | 페이지 번호 순 정렬 | 뒤섞인 순서 | pageNumber 기준 정렬 저장 |
| TOC-04 | 중복 페이지 번호 | 같은 pageNumber 2개 | 허용 (다른 제목) |
| TOC-05 | 0 이하 페이지 번호 | pageNumber=0 | 유효성 에러 |
| TOC-06 | 빈 제목 | title="" | 유효성 에러 |

---

## 2. API Routes

### 2.1 Magazine Page Upload (`POST /api/admin/magazines/[id]/pages`)

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| API-MP01 | 단일 이미지 업로드 | 유효 JPEG 파일 | 201, WebP 변환 저장 |
| API-MP02 | 다중 이미지 업로드 | JPEG 3개 | 201, 3개 모두 저장 |
| API-MP03 | 파일 누락 | files 필드 없음 | 400 |
| API-MP04 | 비이미지 파일 | PDF 파일 | 400: 지원하지 않는 파일 형식 |
| API-MP05 | 20MB 초과 | 25MB 이미지 | 400: 파일 크기 초과 |
| API-MP06 | 존재하지 않는 매거진 | 잘못된 ID | 404 |
| API-MP07 | 첫 업로드 | 페이지 0개 상태 | 커버 이미지 자동 설정 |
| API-MP08 | 추가 업로드 | 기존 페이지 있음 | 커버 변경 안 함, sortOrder 이어서 |
| API-MP09 | 0바이트 파일 | 빈 파일 | 400 또는 500 |
| API-MP10 | 손상된 이미지 | corrupt JPEG | 500: 이미지 처리 실패 |
| API-MP11 | WebP 파일 업로드 | WebP 이미지 | 201, 정상 처리 |
| API-MP12 | PNG 파일 업로드 | PNG 이미지 | 201, WebP 변환 |

### 2.2 Blog Thumbnail Upload (`POST /api/admin/blog/upload`)

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| API-BU01 | 정상 업로드 | 유효 JPEG | 200, { url: "..." } |
| API-BU02 | 파일 누락 | file 필드 없음 | 400 |
| API-BU03 | 지원하지 않는 형식 | GIF 파일 | 400 |
| API-BU04 | 대용량 파일 | 20MB 초과 | 400 또는 500 |

### 2.3 View Tracking (`POST /api/views`)

| ID | 케이스 | 입력 | 기대 결과 |
|----|--------|------|-----------|
| API-V01 | 매거진 조회수 | { type: "magazine", id: "mag_001" } | 204, viewCount +1 |
| API-V02 | 블로그 조회수 | { type: "blog", id: "blog_001" } | 204, viewCount +1 |
| API-V03 | 잘못된 타입 | { type: "video", id: "..." } | 400 |
| API-V04 | ID 누락 | { type: "magazine" } | 400 |
| API-V05 | 빈 ID | { type: "magazine", id: "" } | 400 |
| API-V06 | 존재하지 않는 ID | { type: "magazine", id: "xxx" } | 500 (silent) |
| API-V07 | 동시 요청 (race condition) | 같은 ID 10회 동시 | viewCount 정확히 +10 |

---

## 3. Public Pages (E2E)

### 3.1 홈페이지 (`/`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| PG-H01 | 정상 렌더링 | 헤더, 피처드 포스트, 사이드바, 매거진, 푸터 표시 |
| PG-H02 | 피처드 포스트 | 최신 블로그 포스트가 히어로 영역에 표시 |
| PG-H03 | 사이드바 | 2~4번째 최신 포스트 3개 표시 |
| PG-H04 | 매거진 섹션 | published 매거진 그리드 표시 |
| PG-H05 | 포스트 0개 | 피처드/사이드바/큐레이트 섹션 미표시 |
| PG-H06 | 매거진 0개 | 매거진 섹션 미표시 |
| PG-H07 | 포스트 1개만 | 피처드만 표시, 사이드바 비어있음 |
| PG-H08 | 포스트 링크 | 클릭 시 /blog/[slug]로 이동 |
| PG-H09 | 매거진 링크 | 클릭 시 /magazines/[id]로 이동 |
| PG-H10 | 썸네일 없는 포스트 | STAGE 플레이스홀더 표시 |
| PG-H11 | 태그 표시 | 피처드 포스트 태그 뱃지 렌더링 |
| PG-H12 | 반응형 헤더 | 모바일: 로고만, 데스크톱: 네비 포함 |

### 3.2 매거진 목록 (`/magazines`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| PG-ML01 | 정상 렌더링 | published 매거진 그리드 표시 |
| PG-ML02 | 정렬 (최신호순) | issueNumber 내림차순 |
| PG-ML03 | 정렬 (1호부터) | issueNumber 오름차순 |
| PG-ML04 | 정렬 토글 | 드롭다운 변경 시 즉시 재정렬 |
| PG-ML05 | 매거진 0개 | "No published magazines yet." 표시 |
| PG-ML06 | 발행일 포맷 | "2025년 10월 1일" 한국어 표시 |
| PG-ML07 | 커버 없음 | "No Cover" 플레이스홀더 |
| PG-ML08 | 호버 효과 | 커버 이미지 scale-105 + 오버레이 |
| PG-ML09 | draft 매거진 | 목록에 표시 안 됨 |
| PG-ML10 | 반응형 그리드 | 2~5열 반응형 |

### 3.3 매거진 뷰어 (`/magazines/[id]`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| PG-MV01 | 정상 렌더링 | 매거진 페이지 + 네비게이션 표시 |
| PG-MV02 | 미발행 매거진 접근 | 404 표시 |
| PG-MV03 | 존재하지 않는 ID | 404 표시 |
| PG-MV04 | 페이지 넘김 (데스크톱) | 화살표 클릭으로 페이지 이동 |
| PG-MV05 | 페이지 넘김 (키보드) | ← → 키로 이동 |
| PG-MV06 | 첫 페이지에서 이전 | 이전 버튼 비활성 |
| PG-MV07 | 마지막 페이지에서 다음 | 다음 버튼 비활성 |
| PG-MV08 | 페이지 카운터 | "1-2 / 8" 형식 표시 |
| PG-MV09 | 목차 표시 (데스크톱) | 우측 사이드바 TOC |
| PG-MV10 | 목차 클릭 | 해당 페이지로 이동 |
| PG-MV11 | 조회수 트래킹 | 첫 방문 시 viewCount +1 |
| PG-MV12 | 중복 조회 방지 | 같은 세션 재방문 시 카운트 안 함 |
| PG-MV13 | 모바일 스와이프 | 좌/우 스와이프로 페이지 이동 |
| PG-MV14 | 핀치 줌 | 두 손가락 줌 1~4x |
| PG-MV15 | 줌 상태에서 스와이프 방지 | 줌 중에는 페이지 넘기기 비활성 |
| PG-MV16 | 단일 페이지 매거진 | 1페이지만 표시, 네비 비활성 |
| PG-MV17 | 이미지 로딩 실패 | 깨진 이미지 처리 |
| PG-MV18 | 메타데이터 | title 포함 페이지 타이틀 |

### 3.4 블로그 목록 (`/blog`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| PG-BL01 | 정상 렌더링 | published 포스트 카드 목록 |
| PG-BL02 | 포스트 0개 | 빈 상태 메시지 |
| PG-BL03 | 카드 클릭 | /blog/[slug]로 이동 |
| PG-BL04 | 썸네일 표시 | 이미지 또는 그라데이션 플레이스홀더 |
| PG-BL05 | 태그 표시 | 태그 뱃지 렌더링 |
| PG-BL06 | 날짜 포맷 | 한국어 날짜 표시 |
| PG-BL07 | draft 미표시 | draft 포스트 목록에 안 나옴 |

### 3.5 블로그 상세 (`/blog/[slug]`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| PG-BP01 | 정상 렌더링 | 제목, 저자, 날짜, 태그, 본문 표시 |
| PG-BP02 | 존재하지 않는 slug | 404 표시 |
| PG-BP03 | draft 포스트 접근 | 404 표시 |
| PG-BP04 | HTML 콘텐츠 | 허용 태그만 렌더링 (sanitize-html) |
| PG-BP05 | XSS 시도 | `<script>` 태그 제거 |
| PG-BP06 | 이미지 콘텐츠 | `<img>` 태그 정상 렌더링 |
| PG-BP07 | 조회수 트래킹 | 첫 방문 시 viewCount +1 |
| PG-BP08 | 중복 조회 방지 | sessionStorage 기반 방지 |
| PG-BP09 | 메타데이터 | title, description 메타 태그 |
| PG-BP10 | 목록으로 링크 | "← 목록으로" 클릭 시 /blog |
| PG-BP11 | 썸네일 히어로 | thumbnailUrl 있으면 상단 이미지 |

---

## 4. Admin Pages (E2E)

### 4.1 대시보드 (`/admin`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| AD-D01 | 통계 카드 | 총 조회수, 매거진 조회수, 블로그 조회수 |
| AD-D02 | 매거진 Top 5 | 조회수 기준 상위 5개 |
| AD-D03 | 블로그 Top 5 | 조회수 기준 상위 5개 |
| AD-D04 | 발행 수 | published 매거진/블로그 개수 |
| AD-D05 | 데이터 없음 | 0으로 표시, 에러 없음 |

### 4.2 매거진 관리

#### 매거진 목록 (`/admin/magazines`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| AD-ML01 | 목록 표시 | 모든 매거진 (draft 포함) 표시 |
| AD-ML02 | 호수 내림차순 | issueNumber desc 정렬 |
| AD-ML03 | 페이지 수 표시 | 각 매거진 페이지 개수 |
| AD-ML04 | 상태 뱃지 | 초안/발행됨/미발행 표시 |
| AD-ML05 | 새 매거진 버튼 | /admin/magazines/new 링크 |
| AD-ML06 | 반응형 | 데스크톱: 테이블, 모바일: 카드 |

#### 매거진 생성 (`/admin/magazines/new`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| AD-MC01 | 정상 생성 | 폼 제출 후 편집 페이지로 redirect |
| AD-MC02 | 유효성 에러 | 에러 메시지 폼 하단 표시 |

#### 매거진 편집 (`/admin/magazines/[id]/edit`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| AD-ME01 | 데이터 로드 | 기존 데이터 폼에 채움 |
| AD-ME02 | 존재하지 않는 ID | 404 표시 |
| AD-ME03 | 저장 | 수정 사항 반영 |
| AD-ME04 | 발행 버튼 | 페이지 있으면 발행 |
| AD-ME05 | 발행 실패 | 페이지 없으면 에러 토스트 |
| AD-ME06 | 삭제 | 확인 다이얼로그 후 삭제 |
| AD-ME07 | 페이지 업로드 | 드래그앤드롭 영역 동작 |
| AD-ME08 | 페이지 정렬 | 드래그 순서 변경 |
| AD-ME09 | 페이지 삭제 | 개별 페이지 삭제 |
| AD-ME10 | 파일명 변경 | 인라인 파일명 수정 |
| AD-ME11 | 일괄 이름 변경 | 모든 페이지 번호순 이름 |
| AD-ME12 | TOC 편집 | 항목 추가/삭제/순서변경 |
| AD-ME13 | TOC 저장 | 서버에 저장 + 성공 토스트 |

### 4.3 블로그 관리

#### 블로그 목록 (`/admin/blog`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| AD-BL01 | 목록 표시 | 모든 포스트 (draft 포함) |
| AD-BL02 | 수정일 정렬 | updatedAt desc |
| AD-BL03 | 상태 뱃지 | 초안/발행됨 표시 |
| AD-BL04 | 새 글 버튼 | /admin/blog/new 링크 |

#### 블로그 생성 (`/admin/blog/new`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| AD-BC01 | 정상 생성 | 제출 후 /admin/blog redirect |
| AD-BC02 | 제목 → 슬러그 자동 생성 | 제목 입력 시 슬러그 자동 변환 |
| AD-BC03 | 슬러그 수동 수정 | 수동 수정 후 자동 변환 중단 |
| AD-BC04 | 유효성 에러 | 폼에 에러 메시지 표시 |

#### 블로그 편집 (`/admin/blog/[id]/edit`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| AD-BE01 | 데이터 로드 | 기존 데이터 폼에 채움 |
| AD-BE02 | 존재하지 않는 ID | 404 표시 |
| AD-BE03 | 저장 | 수정 사항 반영 |
| AD-BE04 | 발행 버튼 | 상태 변경 + 토스트 |
| AD-BE05 | 삭제 | 확인 다이얼로그 후 삭제 |
| AD-BE06 | 리치 텍스트 편집 | 볼드/이탤릭/헤딩/리스트/인용 |
| AD-BE07 | 이미지 삽입 (URL) | 에디터에 이미지 추가 |
| AD-BE08 | 이미지 삽입 (업로드) | 파일 업로드 후 에디터에 삽입 |
| AD-BE09 | 이미지 드래그앤드롭 | 에디터에 드롭 시 업로드+삽입 |
| AD-BE10 | 이미지 클립보드 붙여넣기 | Ctrl+V 이미지 업로드+삽입 |
| AD-BE11 | 링크 삽입 | URL 입력 다이얼로그 |
| AD-BE12 | 썸네일 업로드 | 드롭존 업로드 |
| AD-BE13 | 썸네일 삭제 | 기존 썸네일 제거 |

---

## 5. Components (Unit)

### 5.1 ViewTracker (`src/components/public/view-tracker.tsx`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| CMP-VT01 | 첫 방문 | /api/views POST 호출, sessionStorage 기록 |
| CMP-VT02 | 재방문 (같은 세션) | POST 호출 안 함 |
| CMP-VT03 | 다른 콘텐츠 | 다른 ID로 별도 추적 |
| CMP-VT04 | 네트워크 실패 | 에러 무시 (silent) |
| CMP-VT05 | sessionStorage 미지원 | 에러 없이 동작 |

### 5.2 MagazineGrid (`src/components/public/magazine-grid.tsx`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| CMP-MG01 | 초기 정렬 | desc (최신호순) |
| CMP-MG02 | 정렬 변경 | 드롭다운 선택 시 즉시 재정렬 |
| CMP-MG03 | 빈 배열 | "No published magazines" 표시 |
| CMP-MG04 | 날짜 없는 매거진 | 날짜 영역 미표시 |

### 5.3 StatusBadge (`src/components/admin/status-badge.tsx`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| CMP-SB01 | draft | "초안" secondary 뱃지 |
| CMP-SB02 | published | "발행됨" default 뱃지 |
| CMP-SB03 | unpublished | "미발행" outline 뱃지 |
| CMP-SB04 | 알 수 없는 상태 | 기본 처리 (에러 안 남) |

### 5.4 PageUploadZone (`src/components/admin/page-upload-zone.tsx`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| CMP-PU01 | 단일 파일 업로드 | 성공 토스트 |
| CMP-PU02 | 다중 파일 업로드 | 업로드 카운터 표시, 완료 토스트 |
| CMP-PU03 | 4MB 이하 파일 | 압축 건너뜀 |
| CMP-PU04 | 4MB 초과 파일 | 클라이언트 압축 후 업로드 |
| CMP-PU05 | 2400px 초과 너비 | 리사이즈 후 업로드 |
| CMP-PU06 | 업로드 실패 | 실패 건수 토스트 |
| CMP-PU07 | 부분 성공 | "N개 성공, M개 실패" 표시 |

### 5.5 TocEditor (`src/components/admin/toc-editor.tsx`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| CMP-TE01 | 항목 추가 | 새 행 추가 |
| CMP-TE02 | 항목 삭제 | 해당 행 제거 |
| CMP-TE03 | 드래그 정렬 | 순서 변경 |
| CMP-TE04 | 제목 수정 | 인라인 편집 |
| CMP-TE05 | 페이지 번호 수정 | 1~totalPages 범위 |
| CMP-TE06 | 저장 | saveTocEntries 호출 + 성공 토스트 |
| CMP-TE07 | 빈 상태 | "목차 항목이 없습니다" 표시 |

### 5.6 RichTextEditor (`src/components/admin/rich-text-editor.tsx`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| CMP-RT01 | 초기 콘텐츠 | content prop 렌더링 |
| CMP-RT02 | 볼드 토글 | 선택 텍스트 `<strong>` 래핑 |
| CMP-RT03 | 이탤릭 토글 | 선택 텍스트 `<em>` 래핑 |
| CMP-RT04 | 헤딩 1 | `<h1>` 적용 |
| CMP-RT05 | 헤딩 2 | `<h2>` 적용 |
| CMP-RT06 | 불릿 리스트 | `<ul><li>` 적용 |
| CMP-RT07 | 번호 리스트 | `<ol><li>` 적용 |
| CMP-RT08 | 인용 | `<blockquote>` 적용 |
| CMP-RT09 | 링크 삽입 | URL 입력 후 `<a>` 삽입 |
| CMP-RT10 | 이미지 URL 삽입 | 다이얼로그에서 URL 입력 → `<img>` |
| CMP-RT11 | 이미지 파일 업로드 | 업로드 후 `<img>` 삽입 |
| CMP-RT12 | 이미지 드래그앤드롭 | 에디터에 드롭 시 업로드 → 삽입 |
| CMP-RT13 | 이미지 붙여넣기 | Ctrl+V 이미지 업로드 → 삽입 |
| CMP-RT14 | onChange 호출 | 편집 시 HTML 문자열 콜백 |
| CMP-RT15 | 플레이스홀더 | 빈 에디터에 "내용을 입력하세요..." |

---

## 6. Library (Unit)

### 6.1 Upload (`src/lib/upload.ts`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| LIB-UP01 | 매거진 페이지 저장 | WebP 변환, 1200px 리사이즈, 업로드 |
| LIB-UP02 | 블로그 썸네일 저장 | 원본 형식 유지, 업로드 |
| LIB-UP03 | 파일 삭제 | 스토리지에서 제거 |
| LIB-UP04 | 삭제 시 파일 없음 | 에러 무시 (silent) |
| LIB-UP05 | URL 파싱 | 스토리지 경로 정확히 추출 |
| LIB-UP06 | 인코딩된 URL | 디코딩 후 경로 추출 |
| LIB-UP07 | 잘못된 URL | 에러 처리 |

### 6.2 Supabase (`src/lib/supabase.ts`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| LIB-SB01 | 싱글톤 생성 | 두 번 호출해도 같은 인스턴스 |
| LIB-SB02 | 환경변수 누락 | 에러 throw + 변수 이름 표시 |
| LIB-SB03 | getPublicUrl | 올바른 public URL 반환 |

### 6.3 Prisma (`src/lib/prisma.ts`)

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| LIB-PR01 | 싱글톤 생성 | 개발 환경에서 같은 인스턴스 재사용 |
| LIB-PR02 | DB 연결 | PrismaPg 어댑터로 연결 성공 |
| LIB-PR03 | 커넥션 풀 | max 3 연결 제한 |

---

## 7. Security

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| SEC-01 | XSS in blog content | `<script>alert(1)</script>` → sanitize-html이 제거 |
| SEC-02 | XSS in title | HTML 엔티티 이스케이프 |
| SEC-03 | SQL Injection | Prisma 파라미터 바인딩으로 방지 |
| SEC-04 | Path Traversal (upload) | 파일 경로에 `../` 포함 시 차단 |
| SEC-05 | 대용량 파일 업로드 DoS | 20MB 제한 적용 |
| SEC-06 | MIME 타입 위조 | 허용 타입만 통과 |
| SEC-07 | 환경변수 노출 | .env 파일 .gitignore에 포함 |
| SEC-08 | Admin 접근 제어 | (현재 미구현 — 인증 없음) |

---

## 8. Performance

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| PERF-01 | 이미지 최적화 | 매거진: WebP 1200px, 블로그: 원본 |
| PERF-02 | 클라이언트 압축 | 4MB 초과 시 브라우저에서 사전 압축 |
| PERF-03 | DB 쿼리 성능 | force-dynamic, 커넥션 풀 max 3 |
| PERF-04 | 캐시 무효화 | revalidatePath로 관련 경로만 갱신 |
| PERF-05 | 뷰 카운트 동시성 | increment 연산으로 race condition 방지 |

---

## 9. Accessibility

| ID | 케이스 | 기대 결과 |
|----|--------|-----------|
| A11Y-01 | 이미지 alt 텍스트 | 모든 `<img>`에 alt 속성 |
| A11Y-02 | 키보드 네비게이션 | 매거진 뷰어 ← → 키 지원 |
| A11Y-03 | 모바일 햄버거 메뉴 | aria-label="메뉴" |
| A11Y-04 | 폼 라벨 | 입력 필드에 적절한 라벨 |
| A11Y-05 | 색상 대비 | 텍스트/배경 충분한 대비 |
| A11Y-06 | 언어 설정 | `<html lang="ko">` |
