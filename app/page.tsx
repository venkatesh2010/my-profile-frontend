// src/app/page.tsx
'use client'; // This directive is needed for client-side hooks like useEffect

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Import the Next.js Image component

// Define the TypeScript interface for your Post data
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl?: string; // Optional image URL
  published: boolean;
  createdAt: string; // Dates are typically strings from JSON APIs
  updatedAt: string;
  tags: string[];
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Use process.env.NEXT_PUBLIC_BACKEND_URL
        // During local development, if NEXT_PUBLIC_BACKEND_URL is not set, it will fall back to localhost:8080.
        // When deployed on Vercel, Vercel will inject the actual deployed backend URL here.
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        const response = await fetch(`${backendUrl}/api/posts`);

        if (!response.ok) {
          // Handle HTTP errors (e.g., 404, 500)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err: unknown) { // Changed 'any' to 'unknown' for better type safety
        // Safely check if err is an instance of Error to access its message
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        // Set loading to false once fetching is complete (success or error)
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this effect runs only once after the initial render

  // Render loading, error, or no posts states
  if (loading) return <p className="text-center text-gray-500 text-xl mt-20">Loading posts from backend...</p>;
  if (error) return <p className="text-center text-red-500 text-xl mt-20">Error fetching data: {error}</p>;
  if (posts.length === 0) return <p className="text-center text-gray-500 text-xl mt-20">No posts found yet. Add some via the backend API!</p>;

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24 bg-gray-50 font-sans">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8 rounded-xl p-6 bg-white shadow-lg border border-blue-100">
        My Full-Stack Profile Site
      </h1>
      <p className="text-lg md:text-xl text-gray-700 text-center mb-12 max-w-2xl">
        Content dynamically loaded from a Java Spring Boot Backend.
      </p>

      <section className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Latest Blog Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              {post.imageUrl && (
                // Replaced <img> with Next.js <Image /> component for optimization
                // For external images, `unoptimized` can be used if you don't want Vercel to proxy them.
                // width and height are required for <Image /> component.
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={600} // Example width, adjust as needed for your design
                  height={300} // Example height, adjust to maintain aspect ratio
                  className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-200"
                  unoptimized // Use unoptimized for external URLs if you don't want Next.js optimization
                />
              )}
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-700 text-base mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500">Published: {new Date(post.createdAt).toLocaleDateString()}</p>
              {/* You'd add a link to the full post here */}
              <a href={`/blog/${post.slug}`} className="block mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                Read More &rarr;
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Add more sections for About, Projects, Contact etc. */}
    </main>
  );
}
