import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import { useGetPostsQuery } from "./postsSlice";
import { useParams, useNavigate } from "react-router-dom";

import { useUpdatePostMutation, useDeletePostMutation } from "./postsSlice";

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const {
    post,
    isLoading: isLoadingPosts,
    isSuccess,
  } = useGetPostsQuery("getPosts", {
    selectFromResult: ({ data, isLoading, isSuccess }) => ({
      post: data?.entities[postId],
      isLoading,
      isSuccess,
    }),
  });
  const users = useSelector(selectAllUsers);

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.body);
  const [userId, setUserId] = useState(post?.userId);

  useEffect(() => {
    if (isSuccess) {
      setTitle(post.title);
      setContent(post.body);
      setUserId(post.userId);
    }
  }, [isSuccess, post?.title, post?.body, post?.userId]);

  if (isLoadingPosts) return <p>Loading...</p>;

  if (!post) {
    return (
      <section>
        <p>Post not found!</p>
      </section>
    );
  }

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(Number(e.target.value));

  const canSave = [title, content, userId].every(Boolean) && !isLoading;

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        await updatePost({
          title,
          body: content,
          userId,
          reactions: post.reactions,
          id: post.id,
        }).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        navigate(`/post/${postId}`);
      } catch (err) {
        console.error("Failed to save the post", err);
      }
    }
  };

  const onDeletePostClicked = async () => {
    try {
      await deletePost({ id: post.id }).unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the post", err);
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select
          id="postAuthor"
          defaultValue={userId}
          onChange={onAuthorChanged}
        >
          <option value=""></option>
          {usersOptions}
        </select>

        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
        <button
          type="button"
          className="deleteButton"
          onClick={onDeletePostClicked}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
};
export default EditPostForm;
