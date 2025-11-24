# 🤝 Contributing Guide  
JobMate.AI 협업을 위한 브랜치 규칙 및 커밋 규칙입니다.

---

## 🏷 브랜치 네이밍 규칙

### ✔ 기본 브랜치
- **main** → 배포용
- **develop** → 전체 개발 통합

---

## ✔ 기능 개발/작업 브랜치 규칙

브랜치는 아래 패턴으로 생성합니다.


### 📌 타입 목록

| 타입 | 설명 | 예시 |
|------|------|------|
| feat | 새로운 기능 | feat/#이슈번호/login-api |
| fix | 버그 수정 | fix/#이슈번호/token-refresh-error |
| refactor | 리팩토링 | refactor/#이슈번호/interview-service |
| chore | 설정, 빌드, 문서, 환경 등 | chore/#이슈번호/update-env |
| hotfix | 배포 후 긴급 버그 수정 | hotfix/#이슈번호/login-crash |
| docs | 문서 수정 | docs/#이슈번호/readme-update |

---

## 📝 커밋 메시지 규칙

커밋 메시지는 다음 형식을 사용합니다.


### TYPE 목록  
- **FEAT**: 새로운 기능 추가  
- **FIX**: 버그 수정  
- **REFACTOR**: 코드 리팩토링  
- **CHORE**: 세팅/빌드/패키지/환경  
- **DOCS**: 문서 수정  
- **STYLE**: 스타일 변경(세미콜론, 탭 등)  
- **TEST**: 테스트 코드 관련  

---

## 🔀 PR 규칙

- PR 제목은 아래와 같이 작성합니다.  
  - 예: **`[FEAT] 로그인 API 구현`**
- PR은 **작업 브랜치 → develop** 또는 **develop → main**으로 진행합니다.
- 반드시 PR 템플릿 작성 (필수).
- 리뷰어가 이해하기 쉽게 변경점 상세 설명.

---

## ✔ 코드 리뷰 규칙

- 중요 변경사항은 반드시 코드 리뷰 거쳐서 merge.
- 논의가 필요한 부분은 코멘트 남기기.
- 긴급한 경우가 아니라면 self-merge 지양.

