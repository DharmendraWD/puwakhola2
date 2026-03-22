import React from 'react';
import wp from "../../../../public/img/wp1.jpg";
import Navbar from '@/components/Header/Navbar/Navbar';
import Footer from '@/components/Misc/Footer/Footer';
import Image from 'next/image';
import Link from 'next/link';
import HTMLReactParser from 'html-react-parser';

// API fetch functions
async function getBlogById(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000/api';
    const apiUrl = `${baseUrl}/contents/blogs/${id}`;
    
    const res = await fetch(apiUrl, { 
      cache: 'no-store' 
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blog data: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return null;
  }
}

async function getAllBlogs() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000/api';
    const apiUrl = `${baseUrl}/contents/blogs`;
    
    const res = await fetch(apiUrl, { 
     next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs data: ${res.status}`);
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching blogs data:', error);
    return [];
  }
}

// Transform blog data to component format
function transformBlogData(blog) {
  if (!blog) return null;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_CONTENT_URL || 'http://localhost:4000/api';
  
  // Create image URL
  const imageUrl = blog?.cover_image 
    ? `${baseUrl}uploads/blogs/${blog.cover_image}`
    : wp.src;
  
  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Date not available';
    }
  };
  
  return {
    id: blog.id,
    title: blog.title || 'No Title',
    desc: blog.content || '',
    date: formatDate(blog.created_at),
    category: blog.author_name || '',
    img: imageUrl,
    content: blog.content || '',
    author: blog.author_name || ''
  };
}

// Main News Study Content Component (Client Component)
const NewsStudy = ({ blog }) => {
  if (!blog) return null;

  return (
    <div className="text-gray-700 leading-relaxed space-y-8">
      <section>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          {blog.title}
        </h2>
        <div className="prose prose-lg max-w-none">
          {HTMLReactParser(blog.content)}
        </div>
      </section>

      {/* Blog Metadata */}
      <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-gray-300">
        {blog.author && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">Author:</span>
            <span className="text-gray-700">{blog.author}</span>
          </div>
        )}
        {blog.date && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">Published:</span>
            <span className="text-gray-700">{blog.date}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Error component for blog not found
const BlogNotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
    <p className="text-gray-600 mb-8">The blog you're looking for doesn't exist or has been removed.</p>
    <Link href="/blog" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      Back to Blogs
    </Link>
  </div>
);

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Main SSR Component
export default async function NewsDets({ params }) {
  // Extract blog ID from params (no need for useEffect in SSR)
  const blogId = await params.then(p => p.id);
  
  // Fetch data on server
  const [blogData, allBlogsData] = await Promise.all([
    getBlogById(blogId),
    getAllBlogs()
  ]);
  
  const blog = transformBlogData(blogData);
  const allBlogs = (allBlogsData || [])
    .filter(b => b.id !== parseInt(blogId))
    .map(transformBlogData)
    .filter(b => b !== null);
  
  // Handle not found
  if (!blog) {
    return <BlogNotFound />;
  }

  const backgroundImage = blog.img || wp;

  return (
    <>
      {/* Background Image and Content */}
      <div className="min-h-[100vh] flex items-end justify-center font-[Inter] relative overflow-hidden bg-gray-100">
        <Navbar></Navbar>
        {/* Background Image and Overlay Container */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 m-auto">
          {/* Main Text Content */}
          <div className="text-center flex flex-col justify-around mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl mx-auto">
              {blog.title}
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-4 pt-8 border-t border-gray-300">
              {blog.author && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-100">Author:</span>
                  <span className="text-gray-200">{blog.author}</span>
                </div>
              )}
              {blog.date && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-100">Published:</span>
                  <span className="text-gray-200">{blog.date}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Section */}
      <div className="min-h-screen py-12 sm:py-16 md:py-20 font-[Inter] bg-[#e9e9e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 lg:gap-x-16">
            <div className="md:col-span-2 mb-10 md:mb-0">
              <NewsStudy blog={blog} />
            </div>
            <div className="md:col-span-1">
              {/* Newsletter Sidebar can be added here */}
            </div>
          </div>
        </div>
      </div> 

      {/* Other Blogs Section */}
      {allBlogs?.length > 0 && (
        <div>
          <div className='max-w-7xl mx-auto mt-8 mb-8 flex gap-4 justify-between'>
            <h1 className='text-xl ml-3 font-semibold'>Other Blogs</h1>
          </div>
          <div style={{justifyItems:"center"}} className="space-y-8 mb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {allBlogs?.map((blogItem) => (
              <div key={blogItem.id} className="bg-white max-w-[400px] min-w-[400px] justify-between rounded-2xl rounded-br-[95px] shadow-xl transition-all duration-300 hover:shadow-2xl overflow-hidden flex flex-col h-full">
                {/* Image Container */}
                <div className="w-full h-auto overflow-hidden p-4">
                  <Image
                    width={300}
                    height={300}
                    src={blogItem.img}
                    alt={blogItem.title}
                    className="w-[100%] h-[200px] object-cover transition duration-500 ease-in-out hover:scale-[1.03]"
                    unoptimized
                  />
                </div>
                
                {/* Content Area */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-semibold text-gray-800 leading-snug mb-3">
                    {blogItem.title}
                  </h3>
                  <div className="text-base multiline-ellipsis text-gray-600 mb-4 flex-grow">
                    {HTMLReactParser(blogItem.desc.length > 150 ? `${blogItem.desc.substring(0, 150)}...` : blogItem.desc)}
                  </div>
                  <Link href={`/blog/${blogItem.id}`} className="text-blue-600 font-medium hover:text-blue-700 transition duration-150 self-start">
                    Read more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}
