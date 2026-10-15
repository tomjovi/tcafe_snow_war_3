# 작업 인수인계 — 놈들이다: 눈보라 대혼전

## 범위와 요청

- 대상 경로: `/workspace/tcafe_snow_war_3`만 읽고 수정합니다. 다른 최상위 폴더는 조사하거나 변경하지 않습니다.
- 게임 요구사항과 결과 테스트 목록은 이 폴더의 `README.md`를 기준으로 합니다.
- GitHub 대상은 `https://github.com/tomjovi/tcafe_snow_war_3`, 브랜치는 `main`입니다.
- 사용자가 작업 중 인수인계 문서를 수시로 업데이트하고 main 동기화를 잊지 말라고 요청했습니다.

## 현재 구현 상태

- [x] 독립 실행 가능한 HTML/CSS/Vanilla JS 골격과 반응형 Canvas 타이틀 화면
- [x] 입력 처리, 원형 충돌 판정, 오브젝트 풀, Web Audio 효과음, 설정/난이도 모듈
- [x] 30초 아케이드 라운드, 적 생성·좌우 이동·회피·공격, 눈보라/눈입자/충돌 파티클
- [x] 마우스 호버/드래그, 터치 스와이프, 화살표 키 기반 좌우 이동
- [x] 입력에 의존하지 않는 기본 자동 공격과 연사·큰 눈덩이·산탄 자동 공격 강화
- [x] 5단계 난이도, 세부 파라미터 슬라이더, localStorage 저장/기본값 복원
- [x] 연사·큰 눈덩이·산탄 아이템, 중첩 상한·배율·출현 빈도 관리
- [x] 포인트 증감, 동일 적 3연속 명중 Perfect, 일시정지, 결과 통계, 최고 점수 저장
- [x] README 사용/설정/연동/확인 절차와 최상위 index ZIP 스크립트
- [x] JavaScript 전체 `node --check` 통과 및 마우스·터치·키보드 이동 스모크 테스트
- [x] ZIP 생성 및 내부 최상위 `index.html` 확인 (11개 항목, 23,117 bytes)
- [x] 게임 파일 경로에서 외부 URL 참조 없음 확인
- [x] 모바일 포인터 입력은 터치 시작점을 유지하고 좌우 스와이프의 상대 이동량만 적용
- [x] 결과 화면에 홈으로 버튼 추가
- [x] 자동 공격, 이동 중심 조작, 자동 공격 강화형 아이템 3종으로 변경
- [x] 본게임과 별도인 다섯 가지 시각 디자인 미리보기 `design-options.html` 제작; 사용자가 선택하기 전까지 기존 게임 디자인 미적용
- [x] 적 처치 시 충격파·섬광·방사형 눈 파편·화면 흔들림 연출 추가
- [x] 점수 단위를 명중 +10P, Perfect +20P, 피격 −10P로 조정; 기존 최고 기록은 10배 환산
- [x] 변경 후 JavaScript 구문 검사 및 ZIP 최상위 index 확인 (24,409 bytes)
- [x] 타이틀/Perfect/README 점수 안내를 10P 규칙에 맞춤

## 파일 구조

`index.html`, `css/{style,controls}.css`, `config/difficulty.js`, `js/{input,collision,pool,sound,settings,game}.js`, `tools/build_zip.py`, `build-zip.sh`, `README.md`.

## Git 동기화 상태와 제약

- 워크스페이스의 부모 저장소 `origin`은 `https://github.com/tomjovi/_Develope.git`이며 요청한 저장소와 다릅니다. 이 게임은 대상 폴더 안에 독립 Git 저장소를 만들고 지정 원격을 별도로 연결했습니다. 부모 저장소를 동기화/푸시하지 않습니다.
- 지정 저장소 `git ls-remote --symref https://github.com/tomjovi/tcafe_snow_war_3.git HEAD refs/heads/main` 조회를 시도했지만 시스템 credential helper가 `/usr/bin/gh`를 호출하다 실패했습니다 (`gh: not found`). 저장소 상태와 원격 변경을 확인하지 못했습니다.
- credential helper를 비활성화한 동일 조회는 종료 코드 0, 출력 없음이었습니다. 요청한 `HEAD`와 `refs/heads/main` ref가 없어 새 main 브랜치를 초기화했습니다.
- 최신 개선 커밋 `64ae888` 및 배포 인수인계 커밋 `f4ac61e`를 2026-10-15에 지정 GitHub 저장소 `main`으로 push했습니다. 이어 이 문서의 릴리스 상태도 갱신해 원격 동기화할 예정입니다.
- GitHub CLI 인증은 사용자의 `gh auth login` 이후 `/config/.local/bin/gh auth setup-git`으로 Git credential에 연결했습니다. push 시 `/usr/bin/gh` 경로 오류가 있었으나 credential helper 설정 후 정상 전송을 확인했습니다.

## 다음 작업

1. 실제 브라우저에서 자동 발사, 연사/큰 눈덩이/산탄 아이템, 모바일 이동, Perfect 포인트와 30초 종료를 확인합니다. 현재 환경에서는 브라우저 실행기를 찾지 못했습니다.
2. 자동 공격 업데이트는 `config/difficulty.js`의 `autoFireInterval` 및 `rapidFireMinInterval` 값을 사용합니다.
3. 소스 변경 뒤 `bash build-zip.sh`로 ZIP을 다시 만들고 최상위 `index.html` 및 용량을 확인합니다.
4. 배포 작업은 프로젝트 내부 Git의 지정 원격 `main`에 한정합니다. 부모 워크스페이스에서 `git add .`나 전체 경로 커밋을 하지 마세요.

## 연동 필드

런타임 포인트는 `window.gameState.snow_war_point`와 `window.getSnowWarPoint()`로 읽습니다. UI에는 내부 필드명을 노출하지 않습니다.

## 제출 Release

- 기존 GitHub Release v1.0.0: https://github.com/tomjovi/tcafe_snow_war_3/releases/tag/v1.0.0
- 이전 제출 GitHub Release v1.0.1: https://github.com/tomjovi/tcafe_snow_war_3/releases/tag/v1.0.1
- 최신 제출 GitHub Release v1.0.2: https://github.com/tomjovi/tcafe_snow_war_3/releases/tag/v1.0.2
- v1.0.2 ZIP은 게임 푸터에 버전 표시를 추가한 최신 HTML/CSS를 포함합니다. 자산 크기 24,492 bytes.
- v1.1.0 자동 공격 및 이동 중심 조작 변경을 배포했습니다. ZIP은 12개 항목이며 최상위 `index.html`, 자동 공격 스타일을 포함하고 크기는 24,420 bytes입니다.
- `design-options.html`은 다섯 시안 검토용 별도 HTML입니다. `tools/build_zip.py`의 포함 대상에 없으므로 게임 ZIP에는 들어가지 않습니다. GitHub Pages에서는 별도 경로 `/design-options.html`에서 미리볼 수 있습니다.

## GitHub Pages 상태

- 사용자가 승인한 뒤 저장소를 `public`으로 전환했습니다. 소스와 Git 이력도 공개 상태입니다.
- Pages 배포 소스는 `main` 브랜치 루트(`/`)이며 GitHub API 상태는 `built`입니다.
- 서비스 URL: https://tomjovi.github.io/tcafe_snow_war_3/
- 실제 URL에서 HTTP 200과 게임 HTML의 `gameCanvas` 진입점을 확인했습니다.
- v1.0.1 게임 커밋은 원격 `main`과 동기화했고, v1.0.1 Release의 ZIP 업로드를 확인했습니다.
- 버전 UI 변경 커밋 `521ffb6`을 `main`에 push하고 v1.0.2 Release 자산 업로드를 완료했습니다. Pages build `1286443002`가 해당 커밋으로 `built` 상태이며, 캐시 우회 요청에서 HTTP 200과 `VERSION v1.0.2` 표시를 확인했습니다.
- 자동 공격·디자인 검토 페이지 커밋 `ea03ad6`을 2026-10-15에 `main`으로 push했습니다. GitHub Release v1.1.0 ZIP 자산을 확인했습니다. Pages의 게임 및 `/design-options.html`이 모두 HTTP 200이며, 게임 VERSION v1.1.0과 시안 DIRECTION 01–05를 확인했습니다.
