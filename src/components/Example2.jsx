import { useRef, useCallback } from "react";
import Post from "./Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostsPage } from "../api/axios";

const Example2 = () => {
  const {
    data,
    isFetchingNextPage,
    status,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => getPostsPage(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const morePagesExist = lastPage.length === 10; // assuming 10 is the number of posts per page
      return morePagesExist ? allPages.length + 1 : undefined;
    },
  });

  const intObserver = useRef();

  const lastPostRef = useCallback(
    (post) => {
      if (isFetchingNextPage) return;
      //clear previous stored intersection obeserver intance
      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          console.log(`We are near the last post !`);
          fetchNextPage();
        }
      });
      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  if (status === "error") return <p className="text-red-500">Error:{error}</p>;

  const content = data?.pages.map((page) => {
    return page.map((post, index) => {
      if (page.length === index + 1) {
        return <Post ref={lastPostRef} key={post.id} post={post} />;
      }
      return <Post key={post.id} post={post} />;
    });
  });

  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <h1 id="top" className="text-4xl font-bold text-center mb-10">
        &infin;Infinite Query &amp; Scroll <br />
        &infin; Ex.2 - Tanstack Query{" "}
      </h1>
      {content}
      {isFetchingNextPage && (
        <p className="text-green-500 text-center">Loading....</p>
      )}
      <p className="text-center mt-10">
        <a href="#top" className="text-blue-500 hover:underline">
          Back to Top
        </a>
      </p>
    </div>
  );
};

export default Example2;
