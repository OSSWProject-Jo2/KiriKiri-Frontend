# 끼리끼리 Vite React 정리본

붙여준 `Home`, `PostDetail` 코드를 Vite + React Router 기준으로 실행할 수 있게 나눈 구조입니다.

## 구조

```txt
src/
  main.tsx
  App.tsx
  pages/
    Home.tsx
    PostDetail.tsx
  components/
    PostCard.tsx
    ParticipationDialog.tsx
    MatchSuccessDialog.tsx
    ui/
      badge.tsx
      button.tsx
      card.tsx
      input.tsx
      separator.tsx
  data/
    mockPosts.ts
```

## 실행

```bash
npm install
npm run dev
```

브라우저에서 Vite가 안내하는 localhost 주소를 열면 됩니다.
