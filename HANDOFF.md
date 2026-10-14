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
- [x] 마우스·터치 포인터 이동/발사, 화살표 이동, 스페이스 발사와 1초 파워샷 충전
- [x] 5단계 난이도, 세부 파라미터 슬라이더, localStorage 저장/기본값 복원
- [x] 연사·큰 눈덩이·산탄 아이템, 중첩 상한·배율·출현 빈도 관리
- [x] 포인트 증감, 동일 적 3연속 명중 Perfect, 일시정지, 결과 통계, 최고 점수 저장
- [x] README 사용/설정/연동/확인 절차와 최상위 index ZIP 스크립트
- [x] ZIP 생성 및 내부 최상위 `index.html` 확인 (10개 항목, 22,702 bytes)

## 파일 구조

`index.html`, `css/{style,controls}.css`, `config/difficulty.js`, `js/{input,collision,pool,sound,settings,game}.js`, `tools/build_zip.py`, `build-zip.sh`, `README.md`.

## Git 동기화 상태와 제약

- 워크스페이스의 현재 저장소 `origin`은 `https://github.com/tomjovi/_Develope.git`이며 요청한 저장소와 다릅니다. 따라서 해당 origin으로 동기화/푸시하지 않습니다.
- 지정 저장소 `git ls-remote --symref https://github.com/tomjovi/tcafe_snow_war_3.git HEAD refs/heads/main` 조회를 시도했지만 시스템 credential helper가 `/usr/bin/gh`를 호출하다 실패했습니다 (`gh: not found`). 저장소 상태와 원격 변경을 확인하지 못했습니다.
- credential helper를 비활성화한 동일 조회는 종료 코드 0, 출력 없음이었습니다. 요청한 `HEAD`와 `refs/heads/main`이 보이지 않았지만 원격 전체 ref 조회는 응답이 지연되어 중단했습니다. 즉 main 동기화 및 원격 상태는 아직 미완료입니다.
- 저장소 생성/clone/fetch/push를 다시 하기 전, 가능하면 GitHub 인증 도구를 사용할 수 있는지 확인하세요. 현재 폴더만 대상으로 작업하고 다른 경로를 checkout/복사하지 마세요. 원격 인증이 회복되면 기존 main을 먼저 fetch해 병합 여부를 확인한 후 `tcafe_snow_war_3` 하위 경로만 안전하게 동기화하세요. 단, 이 폴더는 부모 저장소에서는 아직 미추적(untracked) 디렉터리였고 별도 Git 메타데이터는 확인되지 않았습니다.

## 다음 작업

1. 브라우저 Console에서 JS 문법/런타임 오류를 확인합니다. 특히 모바일 포인터 드래그/발사, 스페이스 충전, 설정 저장, Perfect 포인트, 30초 종료를 실제 플레이로 점검합니다.
2. 게임 난이도/아이템 중첩 체감 및 세로·가로 레이아웃을 다듬습니다.
3. `bash build-zip.sh`로 ZIP을 재생성합니다. ZIP 최상위 `index.html` 포함은 확인했으며, 소스 변경 후에는 다시 확인하세요.
4. 이 문서의 완료/검증/Git 동기화 항목을 갱신합니다.
5. GitHub 원격 인증이 가능한 시점에 지정 저장소 `main`을 fetch해 동기화합니다. 아직 main ref가 보이지 않아 원격에 대한 commit/push는 하지 않았습니다. 현재 개발 파일은 부모 저장소에서 untracked이며, 작업 트리에는 무관한 untracked 파일이 많으니 `git add .` 또는 전체 경로 커밋을 하지 마세요.

## 연동 필드

런타임 포인트는 `window.gameState.snow_war_point`와 `window.getSnowWarPoint()`로 읽습니다. UI에는 내부 필드명을 노출하지 않습니다.
