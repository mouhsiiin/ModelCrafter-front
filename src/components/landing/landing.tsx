import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, BarChart3, Database, Brain, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Accelerate Your Machine Learning Projects
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover an intuitive platform designed to simplify your machine learning workflows, from dataset management to model evaluation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 transition-all">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-teal-400 hover:bg-teal-400/10 transition-all" style={{ color: 'black' }}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800 hover:bg-teal-700/20 transition-all">
              <CardHeader>
                <Database className="h-14 w-14 mb-4 text-teal-400" />
                <CardTitle className="text-xl">Dataset Management</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-400">
                Seamlessly upload, preprocess, and organize datasets. Supports multiple formats like CSV, JSON, and more.
              </CardContent>
            </Card>

            <Card className="bg-gray-800 hover:bg-blue-700/20 transition-all">
              <CardHeader>
                <Brain className="h-14 w-14 mb-4 text-blue-400" />
                <CardTitle className="text-xl">AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-400">
                Leverage built-in ML algorithms to analyze data and generate predictive insights effortlessly.
              </CardContent>
            </Card>

            <Card className="bg-gray-800 hover:bg-purple-700/20 transition-all">
              <CardHeader>
                <BarChart3 className="h-14 w-14 mb-4 text-purple-400" />
                <CardTitle className="text-xl">Visualization Tools</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-400">
                Create interactive charts and graphs to visualize data trends and model performance metrics.
              </CardContent>
            </Card>

            <Card className="bg-gray-800 hover:bg-red-700/20 transition-all">
              <CardHeader>
                <Lock className="h-14 w-14 mb-4 text-red-400" />
                <CardTitle className="text-xl">Secure Collaboration</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-400">
                Work on projects with teammates securely, with advanced access control and privacy settings.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-teal-700 to-teal-900">
        <Card className="container mx-auto max-w-4xl bg-gray-900 backdrop-blur-lg shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold mb-4 text-white">
                Ready to Revolutionize Your ML Workflow?
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                Sign up today to unlock a suite of tools designed to take your machine learning projects to the next level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 transition-all">
                    Get Started Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-teal-400 hover:bg-teal-400/10 transition-all">
                    Login
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-teal-400 hover:bg-teal-400/10 transition-all">
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
