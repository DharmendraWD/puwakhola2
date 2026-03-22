"use client";
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// API fetch function
async function getBlogsData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000/api';
    const apiUrl = `${baseUrl}/contents/blogs`;
    
    const res = await fetch(apiUrl, { 
      cache: 'no-store' 
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs data: ${res.status}`);
    }
    
    const data = await res.json();
    // console.log(data)
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching blogs data:', error);
    return [];
  }
}

// Transform API data to component format
function transformBlogsData(apiBlogs) {
  if (!apiBlogs || !Array.isArray(apiBlogs)) return [];
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_CONTENT_URL || 'http://localhost:5000/api';
  
  return apiBlogs
    .filter(blog => blog?.title && blog?.title.trim() !== "")
    .map((blog) => {
      // Create image URL
      const imageUrl = blog?.cover_image 
        ? `${baseUrl}uploads/blogs/${blog.cover_image}`
        : '';
      
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
          return new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      };
      
      // Extract plain text from HTML content for excerpt
      const extractExcerpt = (htmlContent) => {
        if (!htmlContent) return '';
        // Remove HTML tags
        const plainText = htmlContent.replace(/<[^>]*>/g, '');
        // Remove extra whitespace and limit to 150 characters
        return plainText.replace(/\s+/g, ' ').trim().substring(0, 150) + '...';
      };
      
      return {
        id: blog.id,
        title: blog.title.trim(),
        excerpt: blog.content ? extractExcerpt(blog.content) : '',
        date: formatDate(blog.created_at),
        category: blog.author_name || '',
        image: imageUrl,
        content: blog.content || '',
        author: blog.author_name || ''
      };
    });
}

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs data on component mount
  useEffect(() => {
    async function fetchBlogsData() {
      try {
        setLoading(true);
        const apiData = await getBlogsData();
        const transformedData = transformBlogsData(apiData);
        setNews(transformedData);
      } catch (error) {
        console.error('Error loading blogs:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogsData();
  }, []);

  if (loading) {
    return (
      <section id="news" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm mb-4">
              Latest Updates
            </div>
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
              News & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Insights</span>
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no news, don't render the section
  if (!news || news.length === 0) {
    return null;
  }
// console.log(news)
  return (
    <section id="news" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm mb-4">
            Latest Updates
          </div>
          <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
            News & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Insights</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed about our latest projects, achievements, and contributions to Nepal's renewable energy landscape.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news?.map((article) => (
            <article
              key={article.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <h1>{article.image}</h1>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                </div>
                
                <h3 className="text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <Link 
                  href={`/blog/${article.id}`} 
                  className="flex items-center gap-2 text-blue-600 group-hover:gap-3 transition-all"
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}