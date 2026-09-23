// lib/blog.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

function extractHeadings(content) {
  const headings = [];
  const lines = content.split('\n');
  let currentSection = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      const title = line.replace('## ', '').trim();
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      headings.push({ level: 2, title, slug, children: [] });
      currentSection = headings[headings.length - 1];
    } else if (line.startsWith('### ') && currentSection) {
      const title = line.replace('### ', '').trim();
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      currentSection.children.push({ level: 3, title, slug });
    }
  }
  return headings;
}

export function getAllPosts() {
  try {
    const files = fs.readdirSync(BLOG_DIR);
    const posts = files
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const filePath = path.join(BLOG_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        const slug = file.replace(/\.md$/, '');
        const toc = extractHeadings(content);
        return {
          slug,
          frontmatter: data,
          content,
          toc,
        };
      })
      .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
    return posts;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export function getPostBySlug(slug) {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    const toc = extractHeadings(content);
    return {
      slug,
      frontmatter: data,
      content,
      toc,
    };
  } catch (error) {
    console.error('Error reading post:', error);
    return null;
  }
}