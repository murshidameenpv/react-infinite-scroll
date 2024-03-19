import { useState, useRef, useCallback } from "react";
import usePosts from "../hooks/usePosts";
import Post from "./Post";
import useDebounce from "../hooks/useDebounce";

const Example1 = () => {
  const [pageNum, setPageNum] = useState(1);
  const debouncedPageNum = useDebounce(pageNum, 400);
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






// The Intersection Observer API is a browser API that provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document’s viewport.

// Let’s break down what this means:

// Target Element: This is the HTML element that you want to observe. For example, it could be an image, a div, a paragraph, or any other HTML element on your webpage.
// Ancestor Element or Top-level Document’s Viewport: This is the HTML element or viewport with which intersection changes are being observed. The viewport refers to the user’s visible area of a web page. An ancestor element is any element that contains the target element in the HTML hierarchy.
// Intersection Changes: This refers to the changes in the overlap between the target element and its ancestor or the viewport. For example, when an image (target element) comes into view as the user scrolls (changes in the viewport), the Intersection Observer API can detect this change.
// Asynchronously Observe: This means that the observation happens in a non-blocking manner. The browser doesn’t have to wait for these observations to complete before it can move on to other tasks. This is important for performance, as it allows the webpage to remain responsive to user input while the observations are being made.
// So, in simple terms, the Intersection Observer API allows you to execute certain actions or trigger callbacks whenever an element becomes visible or hidden in the viewport or within a certain ancestor element. This is particularly useful for things like lazy loading images or infinite scrolling, where you want to load content only when the user scrolls and that content becomes visible in the viewport.