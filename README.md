# Algorithm Visualizer

A production-quality, interactive algorithm visualization tool built with Next.js, React, TypeScript, and Tailwind CSS. This application provides animated, step-by-step visualizations of sorting algorithms and tree data structures to help users understand how algorithms work.

![Algorithm Visualizer](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Algorithm+Visualizer)

## 🚀 Features

### Sorting Algorithms

- **Bubble Sort** - Simple comparison-based algorithm with O(n²) complexity
- **Selection Sort** - In-place comparison sorting with O(n²) complexity
- **Insertion Sort** - Efficient for small datasets with O(n²) average complexity
- **Merge Sort** - Divide-and-conquer algorithm with O(n log n) complexity
- **Quick Sort** - Efficient divide-and-conquer with pivot partitioning
- **Heap Sort** - Comparison-based sorting using heap data structure

### Tree Data Structures

- **Binary Search Tree (BST)** - Insert, delete, search, and traversal operations
- **AVL Tree** - Self-balancing BST with rotation animations
- **Tree Traversals** - In-order, pre-order, and post-order traversals

### Interactive Controls

- ▶️ **Play/Pause** - Automatic step-through with configurable speed
- ⏭️ **Step Forward/Backward** - Manual control over algorithm execution
- 🔄 **Reset** - Return to initial state
- ⚡ **Speed Control** - Adjust animation speed from 0.1x to 5x
- 📊 **Progress Scrubbing** - Jump to any step in the algorithm

### Visualization Features

- **Animated Transitions** - Smooth animations using Framer Motion
- **Color-coded Elements** - Visual indicators for comparisons, swaps, and sorted elements
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Dark/Light Theme** - Toggle between themes for comfortable viewing
- **Interactive Legends** - Understand what each color represents

### Accessibility

- **Keyboard Shortcuts** - Full keyboard navigation support
- **Screen Reader Friendly** - Proper ARIA labels and semantic HTML
- **High Contrast** - Clear visual distinctions for all users

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library + Vitest
- **Linting**: ESLint

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/algorithm-visualizer.git
   cd algorithm-visualizer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Getting Started

1. **Choose Algorithm Type**: Toggle between "Sorting" and "Trees" in the header
2. **Select Algorithm**: Use the dropdown to choose your desired algorithm
3. **Input Data**:
   - Use preset datasets for quick testing
   - Enter custom comma-separated values
   - Generate random data
4. **Control Playback**: Use the control panel to play, pause, step through, or adjust speed
5. **Learn**: Watch the step-by-step description and algorithm information

### Keyboard Shortcuts

- `Space` - Play/Pause
- `←` `→` - Step backward/forward
- `R` - Reset
- `1-5` - Set speed (0.5x to 5x)

### Data Input Options

- **Custom Input**: Enter comma-separated numbers (e.g., `64,34,25,12,22,11,90`)
- **Preset Datasets**: Choose from small, medium, large, reversed, nearly sorted, etc.
- **Random Generation**: Generate random datasets of appropriate size

## 🏗️ Architecture

The application follows a modular architecture with clear separation of concerns:

```
src/
├── algorithms/           # Pure algorithm implementations
│   ├── sorting/         # Sorting algorithm modules
│   │   ├── bubble.ts    # Bubble sort implementation
│   │   ├── merge.ts     # Merge sort implementation
│   │   └── index.ts     # Sorting algorithms registry
│   └── trees/           # Tree algorithm modules
│       ├── bst.ts       # Binary Search Tree
│       ├── avl.ts       # AVL Tree with rotations
│       └── index.ts     # Tree algorithms registry
├── components/          # React components
│   ├── ArrayBars.tsx    # Sorting visualization component
│   ├── TreeCanvas.tsx   # Tree visualization component
│   └── Controls.tsx     # Playback controls
├── hooks/               # Custom React hooks
│   └── usePlayback.ts   # Playback state management
├── types/               # TypeScript type definitions
│   └── algorithm.ts     # Algorithm and step types
└── app/                 # Next.js app directory
    └── page.tsx         # Main application page
```

### Key Design Principles

1. **Pure Functions**: Algorithm logic is separated from UI components
2. **Type Safety**: Comprehensive TypeScript types for all data structures
3. **Modularity**: Easy to add new algorithms by following existing patterns
4. **Performance**: Optimized animations and minimal re-renders
5. **Accessibility**: WCAG compliant with keyboard navigation

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- **Algorithm Logic**: Unit tests for all sorting and tree algorithms
- **Component Rendering**: Tests for UI components and interactions
- **Hook Behavior**: Tests for custom hooks and state management

## 🔧 Adding New Algorithms

### Adding a Sorting Algorithm

1. **Create the algorithm module** in `src/algorithms/sorting/`:

   ```typescript
   // src/algorithms/sorting/newSort.ts
   import { SortingStep } from "@/types/algorithm";

   export function getSteps(array: number[]): SortingStep[] {
     const steps: SortingStep[] = [];
     // Implementation here
     return steps;
   }

   export const newSortInfo = {
     name: "New Sort",
     category: "sorting" as const,
     timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
     spaceComplexity: "O(1)",
     description: "Description of the algorithm",
     pseudocode: ["step 1", "step 2"],
     stable: true,
   };
   ```

2. **Register the algorithm** in `src/algorithms/sorting/index.ts`:

   ```typescript
   import { getSteps as newSortSteps, newSortInfo } from "./newSort";

   export const sortingAlgorithms = {
     // ... existing algorithms
     newSort: {
       name: "New Sort",
       getSteps: newSortSteps,
       info: newSortInfo,
     },
   };
   ```

### Adding a Tree Algorithm

Follow a similar pattern in the `src/algorithms/trees/` directory, implementing the required operations (insert, delete, search, traversal) as needed.

## 🎨 Customization

### Themes

The application supports light and dark themes. Customize colors in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add custom colors here
      },
    },
  },
};
```

### Animation Settings

Adjust animation parameters in the component files:

- **Speed**: Modify base delay in `usePlayback.ts`
- **Transitions**: Update Framer Motion settings in components
- **Colors**: Change step colors in `ArrayBars.tsx` and `TreeCanvas.tsx`

## 📱 Responsive Design

The application is fully responsive and works on:

- **Desktop** (1024px+): Full feature set with side-by-side layout
- **Tablet** (768px-1023px): Stacked layout with compact controls
- **Mobile** (320px-767px): Single column with touch-friendly controls

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
npx vercel --prod
```

### Docker

```bash
docker build -t algorithm-visualizer .
docker run -p 3000:3000 algorithm-visualizer
```

### Static Export

```bash
npm run build
npm run export
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new algorithms
- Ensure accessibility compliance
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Algorithms**: Classic computer science algorithms and data structures
- **Design Inspiration**: Educational visualization tools and interactive learning platforms
- **Libraries**: Thanks to the open-source community for the excellent tools and libraries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/algorithm-visualizer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/algorithm-visualizer/discussions)
- **Email**: your.email@example.com

---

**Built with ❤️ for computer science education**
