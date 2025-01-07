import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, BarChart3, Database, Brain, Lock, ArrowDown, Star, Code, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VedioPage } from '../demo';

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  return (
    <div className="animate-float" style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="space-y-12 text-center">
            <div className="space-y-4">
              <h2 className="inline-flex items-center gap-2 text-teal-400 font-medium px-4 py-2 rounded-full bg-teal-400/10 border border-teal-400/20 mx-auto">
                <Star className="w-4 h-4" />
                Discover the Future of ML Development
              </h2>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Build, Train, Deploy
                </span>
                <br />
                <span className="text-white">Machine Learning Models</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                An end-to-end platform for modern machine learning workflows. From data preprocessing to model deployment, we've got you covered.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup">
                <Button size="lg" className="group relative bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_40px_rgba(45,212,191,0.3)] px-8 py-6 text-lg">
                  Start Building Now
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="border-gray-600 hover:border-teal-400 hover:bg-teal-400/10 transition-all duration-300 px-8 py-6 text-lg">
                  Watch Demo
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              {[
                { number: '10x', text: 'Faster Development' },
                { number: '99.9%', text: 'Model Accuracy' },
                { number: '24/7', text: 'Expert Support' },
              ].map((stat) => (
                <div key={stat.number} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-3xl font-bold text-teal-400 mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ArrowDown className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-6 text-gray-400 animate-bounce" />
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent ml-2">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our platform provides all the tools and features you need to build production-ready machine learning models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AutoML Capabilities",
                description: "Automated model selection and hyperparameter tuning for optimal performance.",
                color: "teal",
              },
              {
                icon: Code,
                title: "Custom Pipelines",
                description: "Build and deploy custom ML pipelines with our intuitive workflow builder.",
                color: "blue",
              },
              {
                icon: Lightbulb,
                title: "Smart Insights",
                description: "Get intelligent suggestions and optimize your models with built-in analytics.",
                color: "purple",
              },
              {
                icon: Database,
                title: "Data Management",
                description: "Powerful tools for data preprocessing, versioning, and quality assurance.",
                color: "emerald",
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Comprehensive dashboards and visualizations for model performance tracking.",
                color: "pink",
              },
              {
                icon: Lock,
                title: "Enterprise Security",
                description: "Bank-grade security with end-to-end encryption and access controls.",
                color: "amber",
              },
            ].map(({ icon: Icon, title, description, color }) => (
              <FloatingElement key={title} delay={Math.random()}>
                <Card className={`group h-full bg-gray-800/40 backdrop-blur-sm border-gray-700/50 hover:bg-${color}-900/20 transition-all duration-500`}>
                  <CardHeader>
                    <div className={`p-3 rounded-lg bg-${color}-400/10 w-fit`}>
                      <Icon className={`h-6 w-6 text-${color}-400`} />
                    </div>
                    <CardTitle className="text-xl mt-4">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-400">
                    {description}
                  </CardContent>
                </Card>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-blue-500/5"></div>
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">See It In Action</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Watch how our platform streamlines your ML workflow from start to finish.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(45,212,191,0.1)]">
            <VedioPage />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-0 shadow-[0_0_100px_rgba(45,212,191,0.1)]">
            <CardContent className="p-12">
              <div className="text-center space-y-8">
                <h2 className="text-4xl font-bold">
                  Ready to Transform Your
                  <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent ml-2">
                    ML Workflow?
                  </span>
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Join thousands of data scientists and ML engineers who are building the future with our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/signup">
                    <Button size="lg" className="group bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg">
                      Get Started Free
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/enterprise">
                    <Button size="lg" variant="outline" className="border-gray-600 hover:border-teal-400 hover:bg-teal-400/10 transition-all duration-300 px-8 py-6 text-lg">
                      Enterprise Plans
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;