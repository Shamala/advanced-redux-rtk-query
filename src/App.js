import "./App.css";
import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddPostForm";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import SinglePagePost from "./features/posts/SinglePostPage";
import EditPostForm from "./features/posts/EditPostForm";
import UserPage from "./features/users/UserPage";
import UsersList from "./features/users/UsersList";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostsList />}></Route>
        <Route path="post">
          <Route index element={<AddPostForm />}></Route>
          <Route path=":postId" element={<SinglePagePost />}></Route>
          <Route path="edit/:postId" element={<EditPostForm />}></Route>
        </Route>
        <Route path="user">
          <Route index element={<UsersList />}></Route>
          <Route path=":userId" element={<UserPage />}></Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
