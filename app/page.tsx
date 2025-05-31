// src/app/page.tsx
'use client'; // This directive is needed for client-side hooks like useEffect

import { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
     slug: string;
content: string;
excerpt: string;
imageUrl?: string;
published: boolean;
createdAt: string;
updatedAt: string;
tags: string[];
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // IMPORTANT: Use the URL of your Java backend!
        // When deployed, this will be your deployed Java backend URL.
        // For local development, it's http://localhost:8080
        const response = await fetch('http://localhost:8080/api/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) return <p className="text-center text-gray-500">Loading posts...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (posts.length === 0) return <p className="text-center text-gray-500">No posts found.</p>;


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Welcome to My Profile Site (Frontend)!
      </h1>
      <p className="text-lg text-gray-600 mt-4 mb-8">
        These posts are fetched from my Java Spring Boot Backend:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            {post.imageUrl && (
              // Using a simple img tag for external URL; Next.js Image component for optimized local images
              <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover rounded-md mb-4" />
            )}
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{post.title}</h2>
            <p className="text-gray-700 text-sm mb-4">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">Published: {new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
