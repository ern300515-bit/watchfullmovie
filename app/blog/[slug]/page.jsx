// app/blog/[slug]/page.jsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '../../../lib/blog';
import BlogContent from './BlogContent'; // ✅ Komponen Client

export const dynamic = 'force-static';
export const revalidate = 86400; // 1 hari

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return {
      title: 'Article Not Found - WatchFullMovie',
      robots: { index: false },
    };
  }
  const title = `${post.frontmatter.title} | WatchFullMovie Blog`;
  const description = post.frontmatter.excerpt || post.frontmatter.title;
  const imageUrl = post.frontmatter.image || 'https://watchfullmovie.netlify.app/og-image.jpg';

  return {
    title,
    description,
    keywords: post.frontmatter.tags?.join(', ') || 'movies, TV shows, streaming',
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.frontmatter.date,
      authors: post.frontmatter.author ? [post.frontmatter.author] : ['WatchFullMovie'],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.frontmatter.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: { canonical: `https://watchfullmovie.netlify.app/blog/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const toc = post.toc || [];

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Link href="/blog" className="text-orange-400 hover:text-orange-300 mb-6 inline-block font-medium">
          ← Back to Blog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <article className="lg:col-span-8 xl:col-span-9 space-y-6">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-white">
                {post.frontmatter.title}
              </h1>
              <div className="text-gray-400 text-sm flex-wrap gap-4 pb-4 border-b border-slate-800">
                {post.frontmatter.date && (
                  <span>📅 {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</span>
                )}
                {post.frontmatter.author && <span>✍️ {post.frontmatter.author}</span>}
                {post.frontmatter.category && <span>🏷️ {post.frontmatter.category}</span>}
                {post.frontmatter.readTime && <span>⏱️ {post.frontmatter.readTime} min read</span>}
              </div>
            </header>

            {toc.length > 0 && (
              <div className="bg-slate-800/50 p-6 rounded-lg mb-10 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3">📑 Table of Contents</h3>
                <ul className="space-y-2">
                  {toc.map((item, index) => (
                    <li key={index}>
                      <a href={`#${item.slug}`} className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                        {item.title}
                      </a>
                      {item.children.length > 0 && (
                        <ul className="pl-4 mt-1 space-y-1">
                          {item.children.map((child, idx) => (
                            <li key={idx}>
                              <a href={`#${child.slug}`} className="text-gray-400 hover:text-white transition-colors text-xs">
                                {child.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ✅ Konten blog dengan banner */}
            <BlogContent post={post} />

            <hr className="border-slate-700 my-8" />
            <div className="flex justify-between text-sm">
              <Link href="/blog" className="text-orange-400 hover:text-orange-300">
                ← All Articles
              </Link>
              <Link href="/" className="text-orange-400 hover:text-orange-300">
                Home →
              </Link>
            </div>
          </article>

          <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="sticky top-24">
              {/* Author Box */}
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {post.frontmatter.author?.charAt(0) || 'W'}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{post.frontmatter.author || 'WatchFullMovie'}</p>
                    <p className="text-gray-400 text-xs">Writer</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs">Sharing insights on movies, TV shows, and streaming guides.</p>
              </div>

              {/* Share Buttons */}
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-6">
                <p className="text-white text-sm font-semibold mb-3">Share this article</p>
                <div className="flex gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.frontmatter.title)}&url=${encodeURIComponent(`https://watchfullmovie.netlify.app/blog/${post.slug}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="bg-slate-700 hover:bg-slate-600 p-2 rounded-full transition"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://watchfullmovie.netlify.app/blog/${post.slug}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="bg-slate-700 hover:bg-slate-600 p-2 rounded-full transition"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(post.frontmatter.title)}&body=${encodeURIComponent(`Read this article on WatchFullMovie: https://watchfullmovie.netlify.app/blog/${post.slug}`)}`}
                    className="bg-slate-700 hover:bg-slate-600 p-2 rounded-full transition"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>
                  </a>
                </div>
              </div>

              {/* Related Articles */}
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-white text-sm font-semibold mb-3">📚 Related</p>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/blog/where-to-watch-movies-online-for-free-legally" className="text-gray-400 hover:text-white">Watch Movie Free Legally</Link></li>
                  <li><Link href="/blog/where-to-watch-netflix-guide" className="text-gray-400 hover:text-white">Netflix Streaming Guide</Link></li>
                  <li><Link href="/blog/best-tv-shows-to-binge-2026" className="text-gray-400 hover:text-white">Best TV Shows to Binge</Link></li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}