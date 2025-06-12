
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import CommentSection from "@/components/CommentSection";

// Mock project data - in a real app this would come from an API
const mockProjects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include user authentication, product management, shopping cart, payment integration, and admin dashboard.",
    longDescription: "This comprehensive e-commerce platform represents a full-stack solution designed to handle modern online retail needs. Built with cutting-edge technologies including React for the frontend, Node.js for the backend, and PostgreSQL for robust data management. The platform features a complete user authentication system, comprehensive product management capabilities, intuitive shopping cart functionality, secure payment integration, and a powerful admin dashboard for business management.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe", "JWT"],
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=800&q=80"
    ],
    demoUrl: "https://demo-ecommerce.example.com",
    githubUrl: "https://github.com/example/ecommerce-platform",
    createdAt: "2024-01-15",
    technologies: ["React 18", "Node.js", "Express", "PostgreSQL", "Stripe API", "JWT Authentication", "Tailwind CSS"],
    features: [
      "User Registration & Authentication",
      "Product Catalog with Search & Filters",
      "Shopping Cart & Checkout Process",
      "Payment Integration with Stripe",
      "Order Management System",
      "Admin Dashboard",
      "Responsive Design"
    ]
  }
];

const ProjectDetail = () => {
  const { id } = useParams();
  const project = mockProjects.find(p => p.id === Number(id));

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Images */}
          <div>
            <div className="mb-4">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {project.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${project.title} ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Project Info */}
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{project.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{project.longDescription}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button 
                size="lg"
                onClick={() => window.open(project.demoUrl, '_blank')}
              >
                <ExternalLink size={16} className="mr-2" />
                Live Demo
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open(project.githubUrl, '_blank')}
              >
                <Github size={16} className="mr-2" />
                View Code
              </Button>
            </div>

            {/* Technologies */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Technologies Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <CommentSection projectId={project.id} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
