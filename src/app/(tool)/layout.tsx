import {AuthProvider} from "@/context/user-auth";

interface AuthLayoutProps {
  children: React.ReactElement;
}

export default function Layout({children}: AuthLayoutProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
