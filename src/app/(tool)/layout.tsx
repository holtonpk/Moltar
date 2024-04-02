import {AuthProvider} from "@/context/user-auth";

interface AuthLayoutProps {
  children: React.ReactElement;
}

export default function Layout({children}: AuthLayoutProps) {
  return (
    <AuthProvider>
      <div className="max-h-screen overflow-hidden">{children}</div>
    </AuthProvider>
  );
}
