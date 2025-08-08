
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUrlByShortCode, incrementUrlClicks } from "@/services/urlService";
import { Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const RedirectPage = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const redirectToOriginalUrl = async () => {
      if (!shortCode) {
        setError("Invalid short URL");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching URL for short code:", shortCode);
        const urlData = await getUrlByShortCode(shortCode);
        
        if (!urlData) {
          console.log("URL not found for short code:", shortCode);
          setError("This short URL does not exist");
          setIsLoading(false);
          return;
        }

        // Check if URL has expired
        if (urlData.expiresAt && new Date(urlData.expiresAt) < new Date()) {
          setError("This short URL has expired");
          setIsLoading(false);
          return;
        }

        // Increment the click count
        await incrementUrlClicks(urlData.id);
        
        // Show the destination before redirecting
        setDestination(urlData.originalUrl);
        setIsLoading(false);
        
        // Redirect after a short delay
        setTimeout(() => {
          // Make sure to handle URLs without http/https prefix
          let url = urlData.originalUrl;
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
          }
          window.location.href = url;
        }, 1500);
      } catch (error) {
        console.error("Error redirecting:", error);
        setError("Something went wrong while redirecting you");
        setIsLoading(false);
      }
    };

    redirectToOriginalUrl();
  }, [shortCode, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <LinkIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Redestiny</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>Looking for your link...</p>
          </div>
        ) : error ? (
          <>
            <div className="text-destructive mb-6">{error}</div>
            <p className="mb-6">
              This link may have been removed or may have never existed.
            </p>
            <Button 
              variant="default"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Go to homepage
            </Button>
          </>
        ) : destination ? (
          <>
            <div className="animate-pulse mb-6">
              <div className="h-2 bg-primary rounded mb-4"></div>
              <div className="h-2 bg-primary rounded w-3/4 mx-auto"></div>
            </div>
            <p className="mb-2">Redirecting you to:</p>
            <p className="text-muted-foreground mb-6 break-all">
              {destination}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default RedirectPage;
