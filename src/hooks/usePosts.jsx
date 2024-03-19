import { useEffect, useState } from "react";
import { getPostsPage } from "../api/axios";

const usePosts = (pageNum = 1) => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIserror] = useState(false);
  const [error, setError] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    setIserror(false);
    setError({});
    const controller = new AbortController();
    const { signal } = controller;

    getPostsPage(pageNum, { signal })
      .then((data) => {
        setResults((prev) => [...prev, ...data]);
        setHasNextPage(Boolean(data.length));
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        if (signal.aborted) return;
        setIserror(true);
        setError({ message: e.message });
      });

    return () => controller.abort();
  }, [pageNum]);

  return { results, isError, isLoading, hasNextPage, error };
};

export default usePosts;

// The AbortController is a web API that allows you to abort one or more web requests as and when desired1. Here’s a brief overview of its usage:

// You can create a new AbortController object using the AbortController() constructor1.
// An instance of AbortController has a signal property, which returns an AbortSignal object instance. This AbortSignal can be used to communicate with, or to abort, an asynchronous operation1.signal is a option of request
// The abort() method of an AbortController instance can be used to abort an asynchronous operation before it has completed. This is able to abort fetch requests, consumption of any response bodies, and streams1.
