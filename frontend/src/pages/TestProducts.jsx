import { useCallback, useEffect, useRef, useState } from "react";

function TestProducts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const fetchPosts = async (page, limit) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
    );
    const data = await response.json();
    return data;
  };


  const loadMorePosts = async () => {
    // setLoading(true);
    const newPosts = await fetchPosts(page, 10);
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    // setLoading(false);
  };

  useEffect(() => {
    loadMorePosts();
  }, [page]);

  const observer = useRef();
  const lastPostElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1); // trigger loading of new posts by chaging page no
      }
    });

    if (node) observer.current.observe(node);
  };
  return (
    <div>
      <h1>Your Feed</h1>
      <ul>
        {posts.map((post, index) => (
          <li
            className="border h-16"
            key={post.id}
            ref={posts.length === index + 1 ? lastPostElementRef : null}
          >
            {post.title}
            {post.body}
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default TestProducts;
