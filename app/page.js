"use client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@stackframe/stack";
import Image from "next/image";
import Link from "next/link";
import { ExpertsList } from "@/services/Options";
import { ArrowRight, Play, Mic, Brain, Languages, Heart, GraduationCap } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Topic-Based Lectures",
      description: "Structured learning sessions with AI-powered voice assistance"
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Mock Interviews",
      description: "Practice real interview scenarios with intelligent feedback"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Q&A Preparation",
      description: "Interactive question-answer sessions for better understanding"
    },
    {
      icon: <Languages className="w-6 h-6" />,
      title: "Language Learning",
      description: "Master new languages with pronunciation guidance"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Meditation Guide",
      description: "Peaceful AI voice guidance for mindfulness practices"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold text-gray-900">EduHelper</span>
        </div>
        <div className="flex items-center space-x-4">
          <UserButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              AI-Powered
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Learning{" "}
              </span>
              Assistant
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your learning experience with personalized AI coaching.
              From lectures to interviews, master any topic with intelligent voice assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
             
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-bounce"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive suite of AI-powered learning tools designed to accelerate your growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-blue-100">Learning Modes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">AI Availability</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Personalized</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of learners who are already experiencing the future of education
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            <span className="text-lg font-semibold">EduHelper</span>
          </div>
          <p className="text-gray-400">
            © 2024 EduHelper. Empowering learners with AI-powered education.
          </p>
        </div>
      </footer>
    </div>
  );
}
