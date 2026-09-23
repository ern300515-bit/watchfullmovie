"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import NativeAd from "../../../components/ads/NativeAd";

export default function BlogContent({ post }) {
  const paragraphCounter = useRef(0);
  const [showNativeAd, setShowNativeAd] = useState(false);

  useEffect(() => {
    setShowNativeAd(true);
  }, []);

  return (
    <div className="prose prose-invert max-w-none prose-headings:text-white prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8 prose-h2:text-2xl prose-h2:font-semibold prose-h2:text-blue-400 prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:text-orange-300 prose-h3:mt-10 prose-h3:mb-3 prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 prose-p:mt-0 prose-p:text-base prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline prose-ul:text-gray-300 prose-ul:pl-6 prose-ul:space-y-2 prose-ul:my-4 prose-li:text-gray-300 prose-li:mb-1 prose-strong:text-white prose-strong:font-semibold prose-table:w-full prose-table:border-collapse prose-table:my-6 prose-th:bg-slate-700 prose-th:text-white prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-slate-600 prose-td:bg-slate-800/50 prose-td:text-gray-300 prose-td:p-3 prose-td:border prose-td:border-slate-600 prose-img:rounded-lg prose-img:shadow-lg prose-img:max-w-full prose-img:h-auto prose-img:mx-auto prose-blockquote:border-l-4 prose-blockquote:border-orange-400 prose-blockquote:pl-4 prose-blockquote:text-gray-400 prose-blockquote:italic">

      {/* Native ad: tampil sebelum isi artikel */}
      {showNativeAd && (
        <div className="not-prose w-full flex justify-center my-6">
          <div className="w-full max-w-4xl mx-auto">
            <NativeAd />
          </div>
        </div>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-semibold text-blue-400 mt-12 mb-4 pt-4 border-t border-slate-800/60" {...props}>
              {children}
            </h2>
          ),

          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-semibold text-orange-300 mt-10 mb-4" {...props}>
              {children}
            </h3>
          ),

          img: ({ node, src, alt, ...props }) => {
            let finalSrc = src;

            if (src?.startsWith("tmdb:")) {
              const parts = src.split(":");
              const id = parts[1] || "500";
              const type = parts[2] || "backdrop";
              const size = parts[3] || "w780";

              finalSrc =
                type === "backdrop"
                  ? `https://image.tmdb.org/t/p/${size}/${id}.jpg`
                  : `https://image.tmdb.org/t/p/w500/${id}.jpg`;
            }

            return (
              <span className="block my-5 w-full overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700/50 shadow-md">
                <img
                  src={finalSrc}
                  alt={alt || "Blog image"}
                  className="w-full h-auto object-cover max-h-[500px] block"
                  loading="lazy"
                  {...props}
                />
                {alt && (
                  <span className="text-center text-xs text-gray-400 py-2 block bg-gray-900/60 italic">
                    {alt}
                  </span>
                )}
              </span>
            );
          },

          p: ({ children }) => {
            const text = children?.toString() || "";

            const isSpecialBlock =
              text.includes("The Plot:") ||
              text.includes("Why you should watch:") ||
              text.includes("Perfect for:") ||
              text.includes("Where to watch:");

            if (!isSpecialBlock) {
              paragraphCounter.current += 1;
            }

            if (text.includes("The Plot:")) {
              return (
                <div className="mt-3 mb-2">
                  <span className="text-blue-400 font-semibold">The Plot:</span>
                  <span className="text-gray-300 ml-1">
                    {text.replace("The Plot:", "")}
                  </span>
                </div>
              );
            }

            if (text.includes("Why you should watch:")) {
              return (
                <div className="mt-3 mb-2">
                  <span className="text-blue-400 font-semibold">Why you should watch:</span>
                  <span className="text-gray-300 ml-1">
                    {text.replace("Why you should watch:", "")}
                  </span>
                </div>
              );
            }

            if (text.includes("Perfect for:")) {
              return (
                <div className="mt-3 mb-2">
                  <span className="text-blue-400 font-semibold">Perfect for:</span>
                  <span className="text-gray-300 ml-1">
                    {text.replace("Perfect for:", "")}
                  </span>
                </div>
              );
            }

            if (text.includes("Where to watch:")) {
              return (
                <div className="mt-3 mb-2">
                  <span className="text-blue-400 font-semibold">Where to watch:</span>
                  <span className="text-gray-300 ml-1">
                    {text.replace("Where to watch:", "")}
                  </span>
                </div>
              );
            }

            return (
              <p className="text-gray-300 leading-relaxed mt-2 mb-4">
                {children}
              </p>
            );
          },

          strong: ({ children }) => {
            const text = children?.toString() || "";
            const labels = [
              "Platform:",
              "Genre:",
              "Seasons:",
              "Episodes:",
              "Starring:",
              "Why It's Underrated:",
              "Detail",
              "Information",
            ];

            return (
              <strong
                className={
                  labels.some((label) => text.includes(label))
                    ? "text-blue-400 font-semibold"
                    : "text-white font-semibold"
                }
              >
                {children}
              </strong>
            );
          },

          table: ({ children }) => (
            <div className="mt-4 mb-6 w-full overflow-x-auto rounded-lg border border-slate-700">
              <table className="w-full text-left text-sm text-gray-300 border-collapse">
                {children}
              </table>
            </div>
          ),

          th: ({ children }) => (
            <th className="bg-slate-800/80 px-4 py-3 font-semibold text-blue-400 border-b border-slate-700">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="px-4 py-3 border-b border-slate-800/60">
              {children}
            </td>
          ),

          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4 text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-slate-800 px-1.5 py-0.5 rounded text-orange-300 text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },

          hr: () => <div className="my-8 border-t border-slate-800" />,
        }}
      >
        {post.content}
      </ReactMarkdown>
    </div>
  );
}