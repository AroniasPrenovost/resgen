import { RssIcon } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogPage = async () => {
  const blogPosts = [
    { href: "/blog/1", title: "How to Write an Attention-Grabbing Resume Summary", date: "2023-01-10" },
    { href: "/blog/2", title: "Top Resume Formats to Get You Noticed", date: "2023-01-15" },
    { href: "/blog/3", title: "Quantifying Achievements: The Key to Standout Resumes", date: "2023-01-20" },
    { href: "/blog/4", title: "Crafting the Perfect Cover Letter to Complement Your Resume", date: "2023-01-25" },
    { href: "/blog/5", title: "Common Resume Mistakes and How to Avoid Them", date: "2023-02-10" },
    { href: "/blog/6", title: "Leveraging Keywords to Pass Resume Screening Software", date: "2023-02-15" },
    { href: "/blog/7", title: "The Importance of Tailoring Your Resume for Each Job Application", date: "2023-02-20" },
    { href: "/blog/8", title: "How to Showcase Soft Skills in Your Resume", date: "2023-03-01" },
    { href: "/blog/9", title: "Professional Resume Templates that Employers Love", date: "2023-03-05" },
    { href: "/blog/10", title: "How to Write a Resume with Little to No Experience", date: "2023-03-10" },
  ];
  
  return (
    <div className="min-h-screen bg-black-50">
      <Heading
        title="Resume Writing Blog"
        description="Master the art of resume writing with tips and tricks from our experts."
        icon={RssIcon}
        iconColor="text-purple-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-8 py-0 space-y-2">
{/*        <div className="text-muted-foreground text-sm">
          Writing the right resume at the right time is all it takes to strike gold.
        </div>
        */}
        <ul className="space-y-4 list-decimal list-inside" style={{listStyleType: 'none'}}>  
          {blogPosts.map((post, index) => (
            <li key={index} className="space-y-1 text-blue-600 hover:underline">
              <a href={post.href} title={post.title}>
                <span className="block text-xs text-muted-foreground">{post.date}</span>
                <span className="block font-semibold">{post.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BlogPage;