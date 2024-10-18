import { RssIcon } from "lucide-react";
import { Heading } from "@/components/heading";
import fs from "fs";
import path from "path";

const BlogPage = async () => {

  // Path to the JSON file
  const filePath = path.resolve("./public/blog_posts.json");
  // console.log('____debugging 2')

  // Read the JSON file asynchronously
  const jsonData = await fs.promises.readFile(filePath, "utf-8");
  // console.log('____debugging 3')

  // Parse the JSON data
  const blogPosts = JSON.parse(jsonData).reverse();
    // console.log('____debugging 4')

  //
  function convertDateString(input:any) {
      // Parse the input date string to a Date object
      const date = new Date(input);

      // Define an array of month names to map month indexes to their names
      const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
      ];

      // Extract the needed values from the Date object
      const year = date.getFullYear();
      const month = monthNames[date.getMonth()]; // getMonth() returns a zero-based index
      const day = date.getDate();

      // Format the date string as "Month Day, Year"
      return `${month} ${day}, ${year}`;
  }
  //


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
          {blogPosts.map((post:any , index: number) => (
            <li key={index} className="space-y-1 text-blue-600 hover:underline">
              {post.title && post.date &&
                <a href={`/blog/resume-writing-tips-tricks-and-services/post/${post.file}`} title={post.title}>
                  <span className="block text-xs text-muted-foreground">{convertDateString(post.date)}</span>
                  <span className="block font-semibold">{post.title}</span>
                </a>
              }
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BlogPage;
