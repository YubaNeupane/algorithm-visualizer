"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  BookOpen,
  Code,
  Users,
  ArrowRight,
  CheckCircle,
  GitBranch,
  Zap,
  Eye,
  Cpu,
  ExternalLink,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  const sortingAlgorithms = [
    "Bubble Sort",
    "Selection Sort",
    "Insertion Sort",
    "Merge Sort",
    "Quick Sort",
    "Heap Sort",
  ];

  const treeAlgorithms = [
    "Binary Search Tree",
    "AVL Tree (with rotations)",
    "Tree Traversals (In/Pre/Post-order)",
  ];

  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Step-by-Step Visualization",
      description:
        "Watch algorithms execute one step at a time with detailed explanations",
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Interactive Controls",
      description: "Play, pause, step through, and control animation speed",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Multiple Data Structures",
      description: "Visualize both sorting algorithms and tree operations",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Performance Insights",
      description: "Learn time and space complexity for each algorithm",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <span className="hidden sm:inline">Algorithm Visualizer</span>
                <span className="sm:hidden">AlgoViz</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/visualizer"
                className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <span className="hidden sm:inline">Visualizer</span>
                <span className="sm:hidden">Try It</span>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight"
              variants={itemVariants}
            >
              <span className="block sm:inline">Interactive Algorithm</span>{" "}
              <span className="block sm:inline">Visualizer</span>
              <br />
              <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                Learn Data Structures Through Animation
              </span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 sm:px-0"
              variants={itemVariants}
            >
              Master sorting algorithms, binary trees, and graph algorithms with
              our free online algorithm simulator. Interactive algorithm
              animation and step-by-step data structure visualization make
              learning computer science concepts intuitive. Perfect for coding
              interview preparation and algorithm tutorial needs.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
              variants={itemVariants}
            >
              <Link
                href="/visualizer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Started
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              <a
                href="#about"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:border-gray-400 dark:hover:border-gray-500 transition-colors text-sm sm:text-base"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Best Online Algorithm Visualizer Features
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
              Transform abstract computer science concepts into visual
              understanding with our interactive algorithm learning platform and
              data structure visualization tools.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
                variants={itemVariants}
              >
                <div className="text-blue-600 dark:text-blue-400 mb-3 sm:mb-4 flex justify-center sm:justify-start">
                  {React.cloneElement(feature.icon, {
                    className: "w-5 h-5 sm:w-6 sm:h-6",
                  })}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center sm:text-left">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center sm:text-left">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                About the Project
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                Algorithm Visualizer is an educational tool designed to make
                learning algorithms intuitive and engaging. By providing
                step-by-step visual representations, we help bridge the gap
                between theoretical knowledge and practical understanding.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      For Students
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      Understand complex algorithms through visual learning and
                      interactive exploration.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      For Developers
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      Refresh your knowledge and gain deeper insights into
                      algorithm performance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      For Educators
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      Enhance your teaching with interactive demonstrations and
                      clear visualizations.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-4">
                  How It Works
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span className="text-sm sm:text-base">
                      Choose an algorithm to visualize
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span className="text-sm sm:text-base">
                      Input your data or use presets
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <span className="text-sm sm:text-base">
                      Watch step-by-step execution
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <span className="text-sm sm:text-base">
                      Learn from detailed explanations
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Supported Algorithms Section */}
      <section className="py-16 sm:py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Supported Algorithms
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
              Explore a comprehensive collection of sorting algorithms and tree
              data structures.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Code className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Sorting Algorithms
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sortingAlgorithms.map((algorithm, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      {algorithm}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <GitBranch className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Tree Structures
                </h3>
              </div>
              <div className="space-y-3">
                {treeAlgorithms.map((algorithm, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      {algorithm}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contribute Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 md:p-12 text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 opacity-90" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Want to Add Your Own Algorithm?
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 px-4 sm:px-0">
              Join our community of contributors and help expand the collection
              of visualized algorithms.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3">
                  Quick Steps:
                </h3>
                <ol className="space-y-2 text-sm">
                  <li>1. Fork the repository on GitHub</li>
                  <li>
                    2. Add your algorithm in{" "}
                    <code className="bg-white/20 px-1 rounded">
                      /algorithms/
                    </code>
                  </li>
                  <li>
                    3. Export a{" "}
                    <code className="bg-white/20 px-1 rounded">getSteps()</code>{" "}
                    function
                  </li>
                  <li>4. Submit a pull request</li>
                </ol>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3">
                  What You Need:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Basic TypeScript knowledge</li>
                  <li>• Understanding of your algorithm</li>
                  <li>• Step-by-step breakdown logic</li>
                  <li>• Algorithm complexity information</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/yourusername/algorithm-visualizer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                <GitBranch className="w-4 h-4 sm:w-5 sm:h-5" />
                View on GitHub
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              <Link
                href="/visualizer"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                Try It First
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Algorithm Visualizer
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Making algorithms accessible through interactive visualization
                and step-by-step learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Quick Links
              </h4>
              <div className="space-y-2">
                <Link
                  href="/visualizer"
                  className="block text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Visualizer
                </Link>
                <a
                  href="#about"
                  className="block text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  About
                </a>
                <a
                  href="https://github.com/yourusername/algorithm-visualizer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  GitHub
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Built With
              </h4>
              <div className="space-y-2 text-gray-400 text-sm sm:text-base">
                <div>Next.js & React</div>
                <div>TypeScript</div>
                <div>Tailwind CSS</div>
                <div>Framer Motion</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base">
              &copy; 2024 Algorithm Visualizer. Built with ❤️ for computer
              science education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
