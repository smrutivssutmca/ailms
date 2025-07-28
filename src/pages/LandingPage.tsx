import React from "react";
import {
  ArrowRight,
  Brain,
  BarChart3,
  Target,
  Zap,
  Users,
  Check,
  Star,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/Button";
import Lottie from "lottie-react";
import learningAnimation from "./learning.json";

export default function LandingPage() {
  // TODO: Replace with real user state from context/auth
  const user = null;
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Learn Smarter with{" "}
                  <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    AI-Powered Assessments
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  SkillShift adapts to your learning curve — get questions tailored to your exact level for optimal
                  growth and engagement.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full bg-sky-600 hover:bg-sky-700 text-lg px-8 py-6" onClick={() => navigate("/register")}>Get Started<ArrowRight className="ml-2 w-5 h-5" /></Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <Lottie
                  animationData={learningAnimation}
                  loop
                  autoplay
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How SkillShift Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI adapts to your learning style in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Take a Quiz",
                description: "Start with an initial assessment to establish your baseline knowledge and skill level.",
                icon: Target,
                color: "from-sky-400 to-sky-600",
              },
              {
                step: "02",
                title: "AI Analyzes Your Skill Level",
                description:
                  "Our intelligent system processes your responses and identifies your strengths and areas for improvement.",
                icon: Brain,
                color: "from-blue-400 to-blue-600",
              },
              {
                step: "03",
                title: "Get Best-Fit Questions",
                description:
                  "Receive personalized questions that challenge you appropriately and accelerate your learning.",
                icon: Zap,
                color: "from-indigo-400 to-indigo-600",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-400">STEP {item.step}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for personalized, effective learning
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Adaptive Learning Paths",
                description: "Dynamic curriculum that evolves with your progress and learning style.",
                icon: Target,
                color: "bg-sky-100 text-sky-600",
              },
              {
                title: "Skill Level Tracking",
                description: "Real-time monitoring of your competency across different topics and subjects.",
                icon: BarChart3,
                color: "bg-blue-100 text-blue-600",
              },
              {
                title: "Real-Time Feedback",
                description: "Instant insights and suggestions to help you improve and stay motivated.",
                icon: Zap,
                color: "bg-indigo-100 text-indigo-600",
              },
              {
                title: "Visual Analytics",
                description: "Beautiful charts and graphs to visualize your learning journey and achievements.",
                icon: Users,
                color: "bg-purple-100 text-purple-600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mx-auto`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What Learners Say</h2>
            <p className="text-xl text-gray-600">Hear from students who've transformed their learning experience</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Computer Science Student",
                content:
                  "SkillShift completely changed how I study. The AI knows exactly when to challenge me and when to reinforce concepts. My grades improved by 40%!",
                rating: 5,
                avatar: "/placeholder.svg?height=60&width=60",
              },
              {
                name: "Marcus Rodriguez",
                role: "Data Science Professional",
                content:
                  "The adaptive learning is incredible. I was struggling with statistics, but SkillShift gradually built my confidence with perfectly timed questions.",
                rating: 5,
                avatar: "/placeholder.svg?height=60&width=60",
              },
              {
                name: "Emily Johnson",
                role: "High School Teacher",
                content:
                  "I use SkillShift with my students and the personalized feedback helps me understand each student's needs better. It's like having an AI teaching assistant.",
                rating: 5,
                avatar: "/placeholder.svg?height=60&width=60",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-sky-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Start Your Personalized Learning Journey Today</h2>
          <p className="text-xl text-sky-100 max-w-2xl mx-auto">
            Join thousands of learners who are already experiencing the power of AI-adaptive education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full bg-white text-sky-600 hover:bg-gray-100 text-lg px-8 py-6" onClick={() => navigate("/register")}>Join Now – It's Free<ArrowRight className="ml-2 w-5 h-5" /></Button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SkillShift</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering learners with AI-driven personalized education for optimal growth and success.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">© 2025 SkillShift. All rights reserved.</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <a
                href="mailto:hello@skillshift.ai"
                className="flex items-center space-x-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>hello@skillshift.ai</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
