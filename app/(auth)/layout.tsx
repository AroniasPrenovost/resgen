const AuthLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <main className="h-full bg-[#0A0B14] flex items-center justify-center">
      {children}
    </main>
  );
}
 
export default AuthLayout;