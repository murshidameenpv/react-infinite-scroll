import { useState, useRef, useCallback } from "react";
import usePosts from "../hooks/usePosts";
import Post from "./Post";
import useDebounce from "../hooks/useDebounce";

const Example1 = () => {
  const [pageNum, setPageNum] = useState(1);
  const debouncedPageNum = useDebounce(pageNum, 1000);
  const { results, isError, isLoading, hasNextPage, error } =
    usePosts(debouncedPageNum);
  //useRef() creates a reference object (intObserver) to store the IntersectionObserver instance.
  //intersection observer
  const intObserver = useRef();

  const lastPostRef = useCallback(
    (post) => {
      if (isLoading) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          console.log(`We are near the last post !`);
          setPageNum((prev) => prev + 1);
        }
      });
      if (post) intObserver.current.observe(post);
    },
    [isLoading, hasNextPage]
  );

  if (isError) return <p className="text-red-500">Error:{error}</p>;

  const content = results.map((post, index) => {
    if (results.length === index + 1) {
      return <Post ref={lastPostRef} key={post.id} post={post} />;
    }
    return <Post key={post.id} post={post} />;
  });

  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <h1 id="top" className="text-4xl font-bold text-center mb-10">
        &infin;Infinite Query &amp; Scroll <br />
        &infin; Ex.1 - React only{" "}
      </h1>
      {content}
      {isLoading && <p className="text-green-500 text-center">Loading....</p>}
      <p className="text-center mt-10">
        <a href="#top" className="text-blue-500 hover:underline">
          Back to Top
        </a>
      </p>
    </div>
  );
};

export default Example1;

// The Example1 component creates a ref using useRef().
// This ref is passed to the last Post component in the list.
// When the Post component is rendered, it attaches the ref to its article element.
// The Example1 component can now detect when this article element comes into view, and fetch more posts when it does

// In React, ref is a special attribute that can be attached to any component. The ref attribute creates a reference to the component, which can be used to access the component’s properties or methods.

// React.forwardRef is a method provided by React that allows a component to pass a ref it receives from its parent to one of its children. It’s useful when you need a reference to an element or component that is rendered inside a component function.
