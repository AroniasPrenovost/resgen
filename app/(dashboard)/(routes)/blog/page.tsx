import { RssIcon } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogPage = async () => {
  const blogPosts = [
    { 
      href: "/blog/resume-writing-tips-tricks-and-services/post/how-to-write-an-attention-grabbing-resume-summary",
      title: "How to Write an Attention-Grabbing Resume Summary",
      date: "2023-01-10"
    },
    { 
      href: "/blog/2",
      title: "Top Resume Formats to Get You Noticed",
      date: "2023-01-15"
    },
  ];
 
  return (
    <div className="min-h-screen bg-black-50">
      <Heading
        title="Resume Writing Blog"
        description="Master the art of resume writing with tips and tricks from our experts."
        icon={RssIcon}
        iconColor="text-grey-700"
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