const LandingLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className="landing-redesign h-full min-h-screen overflow-auto">
      {children}
    </main>
   );
}

export default LandingLayout;
