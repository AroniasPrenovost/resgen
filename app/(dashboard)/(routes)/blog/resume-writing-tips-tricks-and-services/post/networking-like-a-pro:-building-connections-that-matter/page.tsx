import { ClipboardList, Edit3 } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="Networking Like a Pro: Building Connections That Matter"
        description="Unlock the secrets to effective networking and learn how to build meaningful professional relationships that can propel your career forward."
        icon={ClipboardList}
        iconColor="text-blue-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          Networking is not just about collecting business cards or adding connections on LinkedIn. It is about building genuine relationships that can open doors to new opportunities and provide valuable insights. In this post, we will explore strategies for effective networking that can help you advance your career.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">The Importance of Networking</h2>
        <p className="text-gray-700">
          Networking is a crucial component of career development. It allows you to connect with industry professionals, gain access to hidden job markets, and stay updated on the latest trends. A strong network can provide support, mentorship, and opportunities that you might not find through traditional job searching methods.
        </p>

        <h2 className="text-2xl font-bold text-gray-800">Tips for Effective Networking</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Be Genuine:</strong> Approach networking with a mindset of building authentic relationships. Show genuine interest in others and be willing to offer help and support.</li>
          <li><strong>Attend Industry Events:</strong> Participate in conferences, seminars, and workshops related to your field. These events provide excellent opportunities to meet like-minded professionals and expand your network.</li>
          <li><strong>Leverage Social Media:</strong> Use platforms like LinkedIn to connect with industry leaders, join relevant groups, and engage in meaningful conversations. Share valuable content and insights to establish yourself as a thought leader.</li>
          <li><strong>Follow Up:</strong> After meeting someone new, follow up with a personalized message or email. Express your appreciation for the conversation and suggest ways to stay in touch or collaborate in the future.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800">Examples of Successful Networking</h2>
        <p className="text-gray-700">
          Here are some examples of how effective networking can lead to career success:
        </p>

        <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
          <p><strong>Example 1:</strong> Jane, a marketing professional, attended a digital marketing conference where she met a senior executive from a leading agency. They stayed in touch, and a few months later, Jane was offered a position at the agency, significantly advancing her career.</p>
          <p><strong>Example 2:</strong> John, an IT specialist, joined a LinkedIn group for cybersecurity experts. Through active participation and sharing his expertise, he connected with a recruiter who later helped him secure a high-profile job at a top tech company.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700">
          Networking is a powerful tool that can help you build meaningful professional relationships and unlock new career opportunities. By being genuine, attending industry events, leveraging social media, and following up, you can create a strong network that supports your career growth. Start networking like a pro today and watch your career soar!
        </p>
      </div>
      <div className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 mr-4">
            <Edit3 className="w-8 h-8 text-gray-800" />
          </div>  
          <div>
            <p className="text-lg font-medium text-gray-800">David Collins</p>
            <p className="text-sm text-gray-600 font-small">Job Recruiter</p>
            <p className="text-gray-600 pt-2">David Collins is a seasoned job recruiter with over 12 years of experience in the industry. He specializes in networking, personal branding, and helping job seekers navigate the job market to land their ideal roles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;