import { Route, Routes } from "react-router";
import { Toaster } from "sonner";
import { Home } from "./pages/Home";
import { PostDetail } from "./pages/PostDetail";

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  );
}
