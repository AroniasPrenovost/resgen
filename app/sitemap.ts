import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const siteUrl = "https://resumai.services";

type BlogPost = { date: string; file: string; title: string };

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now },
    { url: `${siteUrl}/app/resume-generator`, lastModified: now },
    { url: `${siteUrl}/app/dashboard`, lastModified: now },
    { url: `${siteUrl}/app/blog`, lastModified: now },
  ];

  let posts: BlogPost[] = [];
  try {
    const filePath = path.resolve("./public/blog_posts.json");
    posts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    posts = [];
  }

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/app/blog/resume-writing-tips-tricks-and-services/post/${post.file}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...blogRoutes];
}
