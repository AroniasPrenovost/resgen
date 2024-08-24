import { MessageSquare } from "lucide-react";

import { Heading } from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";

const SettingsPage = async () => {
  const isPro = false; // await checkSubscription();

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
          {isPro ? "You are currently on a Pro plan." : "You must be on a Pro plan to access ResumAI tool."}
        </div>
        {/*<SubscriptionButton isPro={isPro} />*/}
      </div>
    </div>
  );
}

export default SettingsPage;


