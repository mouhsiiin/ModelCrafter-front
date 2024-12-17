import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, BarChart3, Database, Brain, Lock } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-300 to-gray-400 bg-clip-text text-transparent">
            ML Project Management Made Simple
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your machine learning workflow with our intuitive platform for dataset management,
            model training, and result visualization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-accent/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card hover:bg-accent/10 transition-colors">
              <CardHeader>
                <Database className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>Dataset Management</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Upload, preprocess, and manage your datasets with ease. Support for CSV and JSON formats.
              </CardContent>
            </Card>

            <Card className="bg-card hover:bg-accent/10 transition-colors">
              <CardHeader>
                <Brain className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>ML Algorithms</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Access a suite of machine learning algorithms with simple configuration options.
              </CardContent>
            </Card>

            <Card className="bg-card hover:bg-accent/10 transition-colors">
              <CardHeader>
                <BarChart3 className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>Visualization</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Interactive visualizations for data analysis and model performance metrics.
              </CardContent>
            </Card>

            <Card className="bg-card hover:bg-accent/10 transition-colors">
              <CardHeader>
                <Lock className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>Secure Projects</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Create and manage multiple projects with secure access control and sharing options.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <Card className="container mx-auto max-w-4xl bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your ML Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join now to access all features and streamline your machine learning workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Sign Up Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;