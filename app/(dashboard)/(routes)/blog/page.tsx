import { MessageSquare } from "lucide-react";

import { Heading } from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
// import { checkSubscription } from "@/lib/subscription";

const BlogPage = async () => {

  return (
    <div>
      <Heading
        title="Blog"
        description="Tips and tricks to help improve your resume writing."
        icon={MessageSquare}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {"You must be on a Pro plan to access ResumAI tool."}
        </div>
        <a href="#">Hello</a>
      </div>
    </div>
  );
}

export default BlogPage;


