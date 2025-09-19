import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Play, Clock, BarChart3, BookOpen } from "lucide-react";

// SEO-optimized metadata for this specific algorithm page
export const metadata: Metadata = {
  title: "Bubble Sort Algorithm Visualizer - Step by Step Animation",
  description:
    "Learn bubble sort algorithm through interactive visualization. Watch step-by-step bubble sort animation with time complexity O(n²) analysis. Perfect for coding interviews and algorithm tutorials.",
  keywords: [
    "bubble sort",
    "bubble sort algorithm",
    "bubble sort visualization",
    "bubble sort animation",
    "sorting algorithms",
    "algorithm visualizer",
    "bubble sort tutorial",
    "bubble sort complexity",
    "bubble sort step by step",
    "interactive bubble sort",
  ],
  openGraph: {
    title: "Bubble Sort Algorithm Visualizer | Interactive Animation",
    description:
      "Master bubble sort algorithm with step-by-step visualization and interactive controls. Learn time complexity and implementation details.",
    images: [
      {
        url: "/og-images/bubble-sort.png",
        width: 1200,
        height: 630,
        alt: "Bubble Sort Algorithm Visualization",
      },
    ],
  },
  twitter: {
    title: "Bubble Sort Algorithm Visualizer",
    description:
      "Learn bubble sort through interactive step-by-step animation. Perfect for coding interview preparation.",
    images: ["/twitter-cards/bubble-sort.png"],
  },
};

export default function BubbleSortPage() {
  // Structured data for this specific algorithm
  const algorithmSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Bubble Sort Algorithm Visualization and Tutorial",
    description:
      "Interactive bubble sort algorithm visualizer with step-by-step animation, complexity analysis, and implementation guide",
    author: {
      "@type": "Organization",
      name: "Algorithm Visualizer",
    },
    publisher: {
      "@type": "Organization",
      name: "Algorithm Visualizer",
      logo: {
        "@type": "ImageObject",
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://algorithm-visualizer.dev"
        }/logo.png`,
      },
    },
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://algorithm-visualizer.dev"
      }/algorithms/sorting/bubble-sort`,
    },
    image: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://algorithm-visualizer.dev"
    }/images/bubble-sort-visualization.png`,
    articleSection: "Computer Science Education",
    keywords: [
      "bubble sort",
      "sorting algorithms",
      "algorithm visualization",
      "computer science",
      "programming tutorial",
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Understand Bubble Sort Algorithm",
    description:
      "Learn bubble sort algorithm through interactive visualization",
    image: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://algorithm-visualizer.dev"
    }/images/bubble-sort-steps.png`,
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    supply: [
      {
        "@type": "HowToSupply",
        name: "Web Browser",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: "Algorithm Visualizer",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        name: "Open Bubble Sort Visualizer",
        text: "Navigate to the bubble sort visualization page and prepare your data set",
      },
      {
        "@type": "HowToStep",
        name: "Start Animation",
        text: "Click play to watch the bubble sort algorithm animate step by step",
      },
      {
        "@type": "HowToStep",
        name: "Analyze Comparisons",
        text: "Observe how adjacent elements are compared and swapped during each pass",
      },
      {
        "@type": "HowToStep",
        name: "Track Time Complexity",
        text: "Monitor the number of operations to understand O(n²) time complexity",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(algorithmSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema),
        }}
      />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/visualizer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Visualizer
            </Link>
            <div className="text-gray-300">|</div>
            <nav className="text-sm text-gray-600 dark:text-gray-300">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/algorithms" className="hover:text-blue-600">
                Algorithms
              </Link>
              <span className="mx-2">›</span>
              <Link href="/algorithms/sorting" className="hover:text-blue-600">
                Sorting
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900 dark:text-white font-medium">
                Bubble Sort
              </span>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Bubble Sort Algorithm Visualizer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Learn bubble sort algorithm through interactive step-by-step
            visualization. Understand how this fundamental sorting algorithm
            works with animated comparisons, swaps, and detailed complexity
            analysis.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <Clock className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Time: O(n²)</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Space: O(1)</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <BookOpen className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Difficulty: Beginner</span>
            </div>
          </div>

          <Link
            href="/visualizer?algorithm=bubble-sort"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Play className="w-5 h-5" />
            Start Visualization
          </Link>
        </div>

        {/* Algorithm Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              What is Bubble Sort?
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Bubble sort is one of the simplest sorting algorithms to
                understand and implement. It works by repeatedly stepping
                through the list, comparing adjacent elements, and swapping them
                if they are in the wrong order. The pass through the list is
                repeated until the list is sorted.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The algorithm gets its name from the way smaller or larger
                elements "bubble" to the top of the list, just like air bubbles
                rising to the surface of water.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                How Bubble Sort Works
              </h3>

              <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Compare adjacent elements in the array</li>
                <li>If they are in the wrong order, swap them</li>
                <li>
                  Continue through the array until no more swaps are needed
                </li>
                <li>
                  Each pass ensures the largest element "bubbles up" to its
                  correct position
                </li>
              </ol>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Algorithm Complexity
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500 mb-2">
                    O(n²)
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Worst Case
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500 mb-2">
                    O(n²)
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Average Case
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500 mb-2">
                    O(n)
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Best Case
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Space Complexity
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  O(1) - Bubble sort is an in-place sorting algorithm that only
                  requires constant extra memory space.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Algorithms */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Related Sorting Algorithms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/algorithms/sorting/selection-sort"
              className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Selection Sort
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Similar O(n²) time complexity with different approach
              </p>
              <span className="text-blue-600 text-sm font-medium">
                Learn More →
              </span>
            </Link>

            <Link
              href="/algorithms/sorting/insertion-sort"
              className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Insertion Sort
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                More efficient for small datasets
              </p>
              <span className="text-blue-600 text-sm font-medium">
                Learn More →
              </span>
            </Link>

            <Link
              href="/algorithms/sorting/merge-sort"
              className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Merge Sort
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                O(n log n) divide and conquer approach
              </p>
              <span className="text-blue-600 text-sm font-medium">
                Learn More →
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
