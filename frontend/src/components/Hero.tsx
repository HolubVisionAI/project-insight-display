import {Button} from "@/components/ui/button";

const Hero = () => {
    return (
        <section id="home" className="py-20 lg:py-32 bg-gradient-to-br from-background to-muted">
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                        Hi, I'm{" "}
                        <span
                            className="text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Ihor Holub
            </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Full-Stack Developer crafting beautiful, functional web experiences
                        with modern technologies
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200"
                            onClick={() => document.getElementById('projects')?.scrollIntoView({behavior: 'smooth'})}
                        >
                            View My Work
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200"
                        >
                            Get In Touch
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
