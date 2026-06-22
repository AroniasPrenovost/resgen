import { AppShell } from "@/components/app-shell";
// import { checkSubscription } from "@/lib/subscription";
// import { getApiLimitCount } from "@/lib/api-limit";

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  // const apiLimitCount = await getApiLimitCount();
  // const isPro = await checkSubscription();

  return <AppShell>{children}</AppShell>;
}

export default DashboardLayout;
