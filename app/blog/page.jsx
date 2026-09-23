// app/blog/page.jsx
import Link from 'next/link';
import { getAllPosts } from '../../lib/blog';

export const dynamic = 'force-static';

export const metadata = {
  title: 'WatchFullMovie Blog - Movie Reviews, Streaming Guides & Recommendations',
  description: 'Read the latest movie reviews, streaming guides, and entertainment recommendations from WatchFullMovie.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold mb-4">WatchFullMovie Blog</h1>
        <p className="text-gray-400 mb-8">
          Movie reviews, streaming guides, and entertainment recommendations.
        </p>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-slate-600"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {post.frontmatter.title}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {post.frontmatter.excerpt || ''}
                  </p>
                </div>
                <div className="text-right text-gray-500 text-sm whitespace-nowrap">
                  {post.frontmatter.date && (
                    <div>{new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</div>
                  )}
                  {post.frontmatter.author && (
                    <div className="text-xs">by {post.frontmatter.author}</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No articles yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}