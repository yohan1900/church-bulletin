---
name: church-bulletin
description: '열린문교회 주보 JSON 파일 작성 스킬. 주보 원고(텍스트)를 받아 올바른 JSON 구조로 변환할 때 사용. 주보 작성, bulletin 생성, 주보 JSON, 교회 주보 만들기, 주보 파일 생성 시 반드시 이 스킬을 참조할 것.'
argument-hint: '주보 원고 텍스트 또는 날짜'
---

# 열린문교회 주보 JSON 작성 가이드

## 파일 위치 및 등록

- JSON 파일: `data/bulletins/YYYY-MM-DD.json`
- 목록 등록: `data/bulletins.json` 맨 앞에 새 항목 추가 (날짜 내림차순 유지)

```json
// bulletins.json 항목 형식
{ "date": "2026-08-23", "volume": "6", "issue": "34", "title": "제 6 권 34 호 2026, 8, 23" }
```

---

## JSON 최상위 구조

```json
{
  "date": "YYYY-MM-DD",
  "volume": "6",
  "issue": "34",
  "title": "",
  "morningWorship": { ... },
  "eveningWorship": { ... },
  "wednesdayWorship": { ... },
  "dawnPrayer": { ... },
  "districtWorship": { ... },
  "prayerTopics": [],
  "announcements": [ ... ],
  "memoryVerse": { ... },
  "offerings": { ... }
}
```

- `title`: 특별 주일(추수감사, 성탄, 부활 등)에만 값 입력. 일반 주일은 `""`.
- `volume`/`issue`: 원고의 권·호 숫자를 문자열로.

---

## morningWorship (주일낮예배)

```json
"morningWorship": {
  "leader": "이상덕 목사",
  "order": [ ... ],
  "nextWeekPrayer": [
    { "part": "1부 기도", "person": "홍길동 집사" },
    { "part": "2부 기도", "person": "김아무개 장로" }
  ],
  "worshipCommittee": {
    "month": "8월",
    "ushers": "유제균 장로, 박인규 권사",
    "offering": "유병석 집사, 이경은 집사"
  }
}
```

### order 항목 type 값 (필수 준수)

| 순서 항목 | type 값 |
|-----------|---------|
| 시작송 | `hymn` |
| 성시교독 | `responsive` |
| 참회기도 | `repentance` |
| 찬송 | `hymn` |
| 중보기도 | `prayer` |
| 성경봉독 | `scripture` |
| 특송 | `special` |
| 교회소식 | `news` |
| 봉헌 | `offering` |
| 목양기도 | `pastoralPrayer` |
| 설교 | `sermon` |
| 축복기도 | `benediction` |

### order 항목 content 작성 규칙

- 찬송번호: `"36장 (다같이)"` 또는 `"450장(1,5) (위원)"`
- 성시교독: `"10번 시 16편 (다같이)"` (원고의 "교독문N, 시N편" → "N번 시 N편 (다같이)")
- 중보기도 2인: `"박순남 집사<br/>조성돈 장로"` (`<br/>` 사용)
- 설교: `"설교제목<br/>이상덕 목사"` (제목과 목사 이름을 `<br/>`로 구분)
- 찬송(곡명): `"우물가의 여인처럼 (다같이)"`

---

## eveningWorship (주일밤예배)

### 일반 예배 (정상 진행)

```json
"eveningWorship": {
  "enabled": true,
  "prayer": "홍길동 권사",
  "nextPrayer": "김아무개 권사",
  "scripture": "시 126 : 1, 2",
  "sermon": "설교제목",
  "special": "비전찬양대 (다음: 외리 구역)",
  "hymns": ["369장", "354장"]
}
```

### 특별 집회 (연합성회, 외부 장소 개최)

`info` + `location` + `time` + `sermon` 구조 사용:

```json
"eveningWorship": {
  "enabled": true,
  "info": "부여군기독교연합부흥회",
  "location": "동남교회",
  "time": "8월 23~26일, 저녁 7시 30분",
  "sermon": "너는 내게 부르짖으라 (홍일남 목사, 새생명교회 담임)"
}
```

`location`이 있으면 렌더러가 시간/장소/제목 테이블로 표시함.

### 특별 주일 행사 (같은 장소, 특별 이벤트 안내만)

```json
"eveningWorship": {
  "enabled": true,
  "info": "12월 선교예배",
  "prayer": "이정숙 권사",
  "scripture": "딤후 4 : 7, 8",
  "sermon": "선한 싸움",
  "hymns": ["357장"]
}
```

> **주의**: `eveningWorship`에는 절대 `"title"` 키를 쓰지 말 것. 반드시 `"info"` 사용.

---

## wednesdayWorship (수요밤예배)

### 일반 수요예배

```json
"wednesdayWorship": {
  "enabled": true,
  "scripture": "느 3 : 1---32",
  "sermon": "하늘나라 재건 3"
}
```

렌더러가 자동으로 "예배시간: 오후 7시 30분" 안내를 표시함.

### 특별 집회 (외부 장소, 연합행사 등)

`info` + `sermon` 사용 (scripture 없으면 sermon이 info 띠에 함께 표시됨):

```json
"wednesdayWorship": {
  "enabled": true,
  "info": "부여군기독교연합부흥회",
  "sermon": "동남교회 / 저녁 7시 30분 / 홍일남 목사(새생명교회 담임)<br/>주제: 너는 내게 부르짖으라"
}
```

> **주의**: `wednesdayWorship`에도 `"title"` 키를 쓰지 말 것. 반드시 `"info"` 사용.

---

## dawnPrayer (새벽기도회)

```json
"dawnPrayer": {
  "enabled": true,
  "title": "새벽기도회 (얍복강 기도회 5시 50분)",
  "content": "성경통독 (레위기)"
}
```

- `dawnPrayer.title`은 섹션 제목(h2)으로 렌더링되므로 `"title"` 키 사용이 맞음.
- 기도회 없는 기간(다니엘 기도회 등): `"title": "자유롭게 기도합니다"` 등 변경 가능.

---

## districtWorship (구역예배)

```json
// 비활성 (구역보고 없음)
"districtWorship": { "enabled": false }
```

---

## announcements (교회소식)

```json
"announcements": [
  { "order": 1, "content": "저희 교회에 오신 모든 분들을 진심으로 환영하고 축복합니다.<br/>처음 오셨거나 등록하신분들을 최선을 다해 돕겠습니다." },
  { "order": 2, "content": "공지사항 내용" }
]
```

- `order`는 원고의 번호 그대로.
- 줄바꿈은 `<br/>` 사용.
- 소제목이 있는 경우: `<span class=\"sub-content\">소제목 내용</span>` 사용.

---

## memoryVerse (암송말씀)

```json
// 한 줄
"memoryVerse": {
  "text": "하나님의 말씀과 기도로 거룩하여짐이라",
  "reference": "디모데전서 4 : 5"
}

// 두 줄 (text + content)
"memoryVerse": {
  "text": "오라 우리가 굽혀 경배하며",
  "content": "우리를 지으신 여호와 앞에 무릎을 꿇자",
  "reference": "시편 95 : 6"
}
```

- 성경 구절이 두 줄인 경우 `content` 추가.
- `reference` 형식: `"책이름 장 : 절"` (콜론 앞뒤 공백 포함).

---

## offerings (봉헌)

각 헌금 종류의 **정확한 키 이름** (렌더러 매핑):

| 표시 이름 | JSON 키 |
|-----------|---------|
| 십일조 | `tithe` |
| 일천번제 | `thousandOffer` |
| 감사헌금 | `thanks` |
| 맥추감사 | `firstfruitsThanks` |
| 생일감사 | `birthdayThanks` |
| 월삭헌금 | `monthly` |
| 금식헌금 | `fasting` |
| 건축헌금 | `building` |
| 선교헌금 | `mission` |
| 장학헌금 | `scholarship` |
| 구제헌금 | `relief` |
| 꽃꽂이 | `flower` |
| 강단화분 | `platformDecor` |
| 어린이선교 | `childrenMission` |

- 값은 **문자열 배열**: `["홍길동", "김아무개(이아무개)", "무명"]`
- 배우자 이름은 괄호로: `"유제균(박인규)"`
- 원고의 가나다순 유지.
- 해당 주에 없는 헌금 종류는 키 자체를 포함하지 않음.

---

## 자주 하는 실수 방지 체크리스트

- [ ] `eveningWorship` / `wednesdayWorship` 에 `"title"` 키 사용 → **`"info"`로 교체**
- [ ] `dawnPrayer`의 키는 `"title"` 이 맞음 (렌더러가 h2 제목으로 사용)
- [ ] 성시교독 content: "교독문N번, 시N편" 원고 → `"N번 시 N편 (다같이)"` 형식
- [ ] 설교 content: 제목과 목사 이름 `<br/>`로 구분
- [ ] 중보기도 2인: `"홍길동 집사<br/>김아무개 장로"` (`<br/>` 슬래시 포함)
- [ ] `bulletins.json` 맨 앞에 새 항목 추가 (날짜 내림차순 유지)
- [ ] 특별 연합집회는 `eveningWorship.location` 필드 사용하여 장소/시간 표시
- [ ] `prayerTopics`가 없으면 반드시 `[]` (빈 배열) 유지

---

## 작성 절차

1. 원고에서 **날짜, 권, 호, 특별제목** 추출 → 최상위 필드
2. 예배 순서 → `morningWorship.order` (type 값 위 표 참조)
3. 주일밤/수요밤 형태 판단 → 일반/특별집회/외부장소 중 선택
4. 새벽기도회 → `dawnPrayer.title` + `content`
5. 공지사항 → `announcements` (번호 순서 유지)
6. 암송말씀 → `memoryVerse` (한 줄/두 줄 판단)
7. 봉헌 명단 → `offerings` (위 표의 키 이름 사용)
8. `data/bulletins.json` 맨 앞에 새 항목 삽입
