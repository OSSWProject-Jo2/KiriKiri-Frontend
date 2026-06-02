# KiriKiri Frontend

끼리끼리(KiriKiri) 프론트엔드입니다.


## 실행 이전 준비

실행하기 전 Clerk 키를 입력해야 합니다.
### "개발 중에만"
.env.local 환경 파일을 만들어,
개발 버전 Key인 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'에 입력해주세요.

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
```


## 실행

직접 실행하려면:

```bash
cd kirikiri-app
npm run dev
npm run build
```


## 구조

```txt
kirikiri-app/
  app/
    data/
    post/
    sign-in/
    globals.css
    layout.tsx
    page.tsx
    
```
