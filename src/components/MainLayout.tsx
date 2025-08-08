
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-6 w-6 text-primary" />
            <Link to="/" className="font-bold text-xl text-brand-darkBlack">
              Redestiny
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user.photoURL} alt={user.email || "User"} />
                    <AvatarFallback>
                      {user.email ? user.email[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-2">
                  <div className="flex flex-col items-center gap-2 pb-2 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.photoURL} alt={user.email || 'User'} />
                      <AvatarFallback>
                        {user.email ? user.email[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm text-foreground break-all text-center">{user.email}</span>
                  </div>
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer mt-2">
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Redestiny. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
