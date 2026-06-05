# KiriKiri Frontend

끼리끼리(KiriKiri) 프론트엔드입니다.


## 실행 이전 준비

백엔드 API는 `backend/`에 있습니다. 프론트엔드에서 사용하는 API 엔드포인트와 포트를 맞춰주세요.
실행하기 전 Clerk 키를 입력해야 합니다.

### "개발 중에만"
.env.local 환경 파일을 만들어,
개발 버전 Key인 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'에 입력해주세요.

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
```

## 실행

개발 서버 시작:

```powershell
cd KiriKiri/kirikiri-app
npm install
npm run dev
```

프로덕션 빌드 및 시작:

```powershell
cd KiriKiri/kirikiri-app
npm install
npm run build
npm run start
```


## 주요 폴더 구조

```txt
kirikiri-app/
  app/
    components/
    post/
      [id]/
      new/
    sign-in/
    globals.css
    layout.tsx
    page.tsx
  public/
  package.json
  next.config.ts
```
