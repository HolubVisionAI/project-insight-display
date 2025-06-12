
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProjectGallery from "@/components/ProjectGallery";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProjectGallery />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
