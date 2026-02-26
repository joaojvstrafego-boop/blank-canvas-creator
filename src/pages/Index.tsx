import NetflixNavbar from "@/components/NetflixNavbar";
import NetflixHero from "@/components/NetflixHero";
import ContentRows from "@/components/ContentRows";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NetflixNavbar />
      <NetflixHero />
      <ContentRows />
    </div>
  );
};

export default Index;
