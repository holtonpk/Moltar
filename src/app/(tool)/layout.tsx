import {AuthProvider} from "@/context/user-auth";

interface AuthLayoutProps {
  children: React.ReactElement;
}

export default function Layout({children}: AuthLayoutProps) {
  return (
    <AuthProvider>
      <div className="md:max-h-screen md:overflow-hidden ">{children}</div>
    </AuthProvider>
  );
}
