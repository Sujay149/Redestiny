
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Link as LinkIcon, BarChart, Shield, Clock, Users } from "lucide-react";
import AuthModal from "@/components/AuthModal";

const LandingPage = () => {
  const { user, totalUsers } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <MainLayout>
      {/* Hero section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-primary/10 via-secondary/30 to-white" />
        <div className="container px-4 md:px-6 flex flex-col items-center text-center">
          <div className="flex items-center justify-center p-2 bg-secondary rounded-full mb-4 animate-bounce">
            <LinkIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 font-poppins drop-shadow-lg">
            Short Links, <span className="text-primary">Big Impact</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mb-8 font-inter">
            Create memorable, branded links with our easy-to-use URL shortener.
            Track clicks, manage links, and boost your online presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            {user ? (
              <Button asChild className="w-full animate-fade-in" size="lg">
                <Link to="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full animate-fade-in" 
                  size="lg"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Log In
                </Button>
                <Button 
                  className="w-full animate-fade-in" 
                  size="lg"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          
          {/* User count indicator */}
          <div className="mt-12 flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border animate-pulse">
            <Users className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">
              Join <span className="text-primary font-bold">{totalUsers}</span> users already using Redestiny
            </p>
          </div>
         
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-muted to-transparent my-12" />
      {/* Features section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4 font-poppins">Powerful URL Shortening Features</h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto font-inter">
              Everything you need to create, manage and track your shortened URLs in one place.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="feature-card flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:scale-105">
              <div className="p-3 rounded-full bg-secondary mb-4">
                <LinkIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2 font-poppins">Custom Short Links</h3>
              <p className="text-muted-foreground font-inter">
                Create memorable URLs with custom domains and personalized back-halves.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:scale-105">
              <div className="p-3 rounded-full bg-secondary mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2 font-poppins">Click Analytics</h3>
              <p className="text-muted-foreground font-inter">
                Track performance with detailed click analytics for each shortened URL.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-card flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:scale-105">
              <div className="p-3 rounded-full bg-secondary mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2 font-poppins">Expiration Dates</h3>
              <p className="text-muted-foreground font-inter">
                Set expiration dates for temporary links that automatically deactivate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-muted to-transparent my-12" />
      {/* CTA section */}
      <section className="relative py-16 bg-gradient-to-br from-primary to-primary/80 shadow-xl">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-primary/30 to-primary" />
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-poppins drop-shadow-lg">
            Ready to Shorten Your URLs?
          </h2>
          <p className="text-primary-foreground/90 max-w-[700px] mx-auto mb-8 font-inter">
            Join thousands of users who trust Redestiny for their URL shortening needs.
          </p>
          {!user && (
            <Button 
              asChild 
              size="lg" 
              variant="secondary" 
              className="animate-bounce shadow-lg"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <div>Create Your Free Account</div>
            </Button>
          )}
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </MainLayout>
  );
};

export default LandingPage;
