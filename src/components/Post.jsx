/* eslint-disable react/prop-types */
import React from "react";

// eslint-disable-next-line react/display-name
const Post = React.forwardRef(({ post }, ref) => {
  const postBody = (
    <>
      <p className="text-sm text-gray-500 underline font-semibold">
        Post ID: {post.id}
      </p>
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{post.title}</h2>
      <p className="mb-2 text-gray-700">{post.body}</p>
    </>
  );

  const content = ref ? (
    <article
      ref={ref}
      className="bg-white p-5 rounded-lg shadow-lg mb-5 border border-gray-200"
    >
      {postBody}
    </article>
  ) : (
    <article className="bg-white p-5 rounded-lg shadow-lg mb-5 border border-gray-200">
      {postBody}
    </article>
  );

  return content;
});

export default Post;
