export const SKILL_CATEGORIES = [
  {
    id: 'react-frontend',
    name: 'React & Modern Frontend',
    icon: 'Code2',
    color: 'from-cyan-500 to-blue-600',
    description: 'Hooks, Virtual DOM, State Management (Redux/Zustand), SSR, and Component Lifecycle.',
    timeLimitMinutes: 10,
    passingScorePercent: 80,
    badgeName: 'React Certified Pro',
    questions: [
      {
        id: 'rf-1',
        question: 'What is the primary benefit of using `useCallback` in React?',
        options: [
          'To cache computationally expensive function return values',
          'To memoize callback functions across re-renders preventing unnecessary child component updates',
          'To create asynchronous event listeners attached to DOM nodes',
          'To force child components to skip virtual DOM reconciliation'
        ],
        correctAnswer: 1,
        explanation: 'useCallback returns a memoized version of the callback that only changes if one of the dependencies has changed.'
      },
      {
        id: 'rf-2',
        question: 'In React 18+, what is the purpose of `useTransition` hook?',
        options: [
          'To animate CSS transitions seamlessly',
          'To mark state updates as non-urgent transitions so UI stays responsive during heavy renders',
          'To handle React Router page route transitions',
          'To safely transition from class components to functional hooks'
        ],
        correctAnswer: 1,
        explanation: 'useTransition lets you update the state without blocking the UI, keeping inputs and interactions responsive.'
      },
      {
        id: 'rf-3',
        question: 'Why should keys in React lists be unique and stable rather than array indices?',
        options: [
          'Array indices cause JavaScript runtime memory leaks',
          'Indices can break reconciliation when items are reordered, inserted, or removed, causing stale state bugs',
          'React does not compile code if array indices are passed as keys',
          'CSS pseudo-selectors fail to match elements keyed with numbers'
        ],
        correctAnswer: 1,
        explanation: 'Using indices as keys can cause subtle bugs and degraded performance when items are sorted, filtered, or reordered.'
      },
      {
        id: 'rf-4',
        question: 'What is the purpose of `React.forwardRef`?',
        options: [
          'To pass a DOM ref directly through a component to one of its child DOM elements',
          'To redirect page URLs automatically in Next.js',
          'To forward Redux dispatch actions to sub-reducers',
          'To reference global window variables inside server-side components'
        ],
        correctAnswer: 0,
        explanation: 'React.forwardRef lets a component expose a DOM node to a parent component using a ref.'
      },
      {
        id: 'rf-5',
        question: 'When should you use `useLayoutEffect` instead of `useEffect`?',
        options: [
          'Always for all API fetch calls',
          'When you need to synchronously read layout from DOM and synchronously re-render before browser paints',
          'Only when running inside Node.js Server-Side Rendering (SSR)',
          'When managing WebSockets and real-time Socket.io connections'
        ],
        correctAnswer: 1,
        explanation: 'useLayoutEffect fires synchronously after all DOM mutations. Use it to read layout from DOM and synchronously re-render.'
      },
      {
        id: 'rf-6',
        question: 'In Tailwind CSS, how do you apply styles only for screens larger than 768px (tablets and desktop)?',
        options: [
          '@media (min-width: 768px)',
          'md:style-class (e.g. md:flex md:grid-cols-2)',
          'tablet:style-class',
          'desktop-only:style-class'
        ],
        correctAnswer: 1,
        explanation: 'Tailwind is mobile-first. Breakpoint prefixes like md: apply to screen sizes greater than or equal to 768px.'
      },
      {
        id: 'rf-7',
        question: 'How does the React Virtual DOM improve performance?',
        options: [
          'By compiling JSX directly into WebAssembly machine code',
          'By computing diffs in memory and applying only minimal batched changes to the real DOM tree',
          'By storing the entire DOM structure on cloud servers',
          'By disabling browser layout recalculations completely'
        ],
        correctAnswer: 1,
        explanation: 'Virtual DOM compares changes in memory (reconciliation) and updates only the modified real DOM elements in batches.'
      },
      {
        id: 'rf-8',
        question: 'What is hydration in React SSR frameworks like Next.js or Remix?',
        options: [
          'Cleaning browser cookies on server response',
          'The process where client-side React attaches event listeners to pre-rendered server HTML markup',
          'Compressing SVG and WebP images on the edge CDN',
          'Reloading stale Redux state from local storage'
        ],
        correctAnswer: 1,
        explanation: 'Hydration is when client React takes over static HTML sent from the server and attaches event handlers to make it interactive.'
      },
      {
        id: 'rf-9',
        question: 'Which Hook should you use to store a mutable value that does NOT trigger a re-render when changed?',
        options: [
          'useState',
          'useRef',
          'useMemo',
          'useReducer'
        ],
        correctAnswer: 1,
        explanation: 'useRef returns a mutable object whose .current property can hold any value without triggering component re-renders.'
      },
      {
        id: 'rf-10',
        question: 'In Modern React 19 / Server Components, which components run strictly on the server and do not ship JS bundle to the browser?',
        options: [
          'Client Components marked with "use client"',
          'React Server Components (RSC) by default unless marked with "use client"',
          'Redux Connected Containers',
          'Pure JavaScript classes'
        ],
        correctAnswer: 1,
        explanation: 'React Server Components render on the server without sending their JavaScript to the client bundle, reducing bundle size.'
      }
    ]
  },
  {
    id: 'nodejs-backend',
    name: 'Node.js & Backend Architecture',
    icon: 'Server',
    color: 'from-emerald-500 to-teal-600',
    description: 'Event Loop, Express REST APIs, Mongoose MongoDB indexing, JWT Authentication, and Microservices.',
    timeLimitMinutes: 10,
    passingScorePercent: 80,
    badgeName: 'Node Backend Specialist',
    questions: [
      {
        id: 'nb-1',
        question: 'How does Node.js handle thousands of concurrent I/O operations with a single-threaded JavaScript runtime?',
        options: [
          'It spawns a new OS thread for every HTTP request',
          'Through non-blocking asynchronous I/O and the Libuv Event Loop delegation',
          'By translating JavaScript code to compiled C++ at runtime',
          'By executing code in a multi-core Java Virtual Machine container'
        ],
        correctAnswer: 1,
        explanation: 'Node.js uses Libuv event loop and asynchronous non-blocking system calls to handle concurrent operations efficiently.'
      },
      {
        id: 'nb-2',
        question: 'In Express.js, what must you call inside a middleware function to pass control to the next handler?',
        options: [
          'return res.send()',
          'next()',
          'process.nextTick()',
          'res.continue()'
        ],
        correctAnswer: 1,
        explanation: 'Calling next() passes control to the next middleware function in the stack.'
      },
      {
        id: 'nb-3',
        question: 'What is the primary advantage of adding indexes on MongoDB query fields (e.g., `{ email: 1 }`)?',
        options: [
          'It encrypts sensitive data with AES-256',
          'It allows MongoDB to locate matching documents using B-Trees without scanning every document in the collection (COLLSCAN)',
          'It automatically converts JSON payloads into XML',
          'It prevents duplicate documents without requiring validation rules'
        ],
        correctAnswer: 1,
        explanation: 'Indexes prevent full collection scans (COLLSCAN) by providing fast ordered B-Tree lookups.'
      },
      {
        id: 'nb-4',
        question: 'What is the standard header format for passing a JWT Bearer token in REST API requests?',
        options: [
          'Cookie: token=<jwt>',
          'Authorization: Bearer <token>',
          'X-Auth-Token: <token>',
          'Authentication: Basic <token>'
        ],
        correctAnswer: 1,
        explanation: 'The standard RFC 6750 header format is "Authorization: Bearer <token>".'
      },
      {
        id: 'nb-5',
        question: 'How do you prevent SQL Injection and NoSQL Operator Injection in Node.js Express backends?',
        options: [
          'By sanitizing req.body with libraries like mongo-sanitize or express-validator and using parameterized queries',
          'By only accepting GET requests',
          'By converting all numbers to strings',
          'By using base64 encoding on all input fields'
        ],
        correctAnswer: 0,
        explanation: 'Sanitizing inputs to strip $ and . operators and using schema validations prevents NoSQL injection attacks.'
      },
      {
        id: 'nb-6',
        question: 'What is the purpose of Node.js Streams?',
        options: [
          'To stream live video to YouTube',
          'To process large chunks of data sequentially piece by piece without loading the entire payload into RAM',
          'To compress gzip files in background',
          'To connect directly to Redis pub/sub'
        ],
        correctAnswer: 1,
        explanation: 'Streams allow reading and writing continuous data piece-by-piece, keeping memory usage constant regardless of file size.'
      },
      {
        id: 'nb-7',
        question: 'What HTTP status code should be returned when a client attempts to access a protected route with an invalid or expired JWT token?',
        options: [
          '200 OK',
          '401 Unauthorized',
          '404 Not Found',
          '500 Internal Server Error'
        ],
        correctAnswer: 1,
        explanation: '401 Unauthorized indicates that the request requires valid authentication credentials.'
      },
      {
        id: 'nb-8',
        question: 'In Mongoose, what is the difference between `populate()` and an embedded subdocument schema?',
        options: [
          'populate() queries a separate referenced collection by ObjectId, while embedded subdocuments reside inside the same document',
          'populate() is only available in MySQL databases',
          'Embedded subdocuments cannot have timestamps',
          'There is no functional difference'
        ],
        correctAnswer: 0,
        explanation: 'populate() performs a cross-reference query similar to a foreign key join, while embedded documents are stored inside the document.'
      },
      {
        id: 'nb-9',
        question: 'Why should you NEVER store plain text passwords in databases, and which library is standard in Node.js for password hashing?',
        options: [
          'Plaintext exposes credentials upon breaches; use bcrypt or Argon2 with unique salts',
          'Plaintext is prohibited by JSON standards; use JSON.stringify',
          'Databases reject plain strings; use base64',
          'Plaintext increases disk storage size; use gzip'
        ],
        correctAnswer: 0,
        explanation: 'bcrypt uses salted hashing with adjustable work factor to resist rainbow table and brute force attacks.'
      },
      {
        id: 'nb-10',
        question: 'What is the purpose of CORS (Cross-Origin Resource Sharing) middleware in an Express application?',
        options: [
          'To accelerate server response times through compression',
          'To instruct browsers whether cross-origin HTTP requests from specific frontends (origins) are permitted',
          'To automatically encrypt all database connections',
          'To generate SSL certificates dynamically'
        ],
        correctAnswer: 1,
        explanation: 'CORS sets HTTP response headers allowing the browser to load resources from a different origin domain.'
      }
    ]
  },
  {
    id: 'python-ai',
    name: 'Python, AI & Data Engineering',
    icon: 'Cpu',
    color: 'from-amber-500 to-orange-600',
    description: 'FastAPI, Pandas Data Manipulation, Prompt Engineering, Vector Embeddings, and ML pipelines.',
    timeLimitMinutes: 10,
    passingScorePercent: 80,
    badgeName: 'Python & AI Specialist',
    questions: [
      {
        id: 'py-1',
        question: 'In Python, what is a generator function and how does the `yield` keyword differ from `return`?',
        options: [
          'yield terminates the program immediately',
          'yield produces a sequence of values lazily on-demand, suspending state between iterations without storing all items in RAM',
          'yield executes the function asynchronously in a separate OS thread',
          'yield converts arrays into dictionaries'
        ],
        correctAnswer: 1,
        explanation: 'Generators use yield to generate values one at a time on demand (lazy evaluation), maintaining minimal memory footprint.'
      },
      {
        id: 'py-2',
        question: 'What are Vector Embeddings in modern AI/LLM applications?',
        options: [
          'Vector graphics (.SVG) created for web interfaces',
          'High-dimensional numerical arrays that capture semantic meaning and relationships of text or images',
          'SQL queries converted into binary format',
          'Specialized CSS transforms for 3D elements'
        ],
        correctAnswer: 1,
        explanation: 'Embeddings represent words, sentences, or concepts as high-dimensional float vectors where semantic similarity correlates with vector distance (cosine similarity).'
      },
      {
        id: 'py-3',
        question: 'What is RAG (Retrieval-Augmented Generation) in LLM architectures?',
        options: [
          'A method to generate random test datasets for models',
          'Retrieving relevant external facts from a vector database and injecting them into the LLM prompt for grounded answers',
          'Compressing deep learning neural networks onto microcontrollers',
          'Automated code formatting for Python scripts'
        ],
        correctAnswer: 1,
        explanation: 'RAG retrieves contextually relevant knowledge from external data stores and passes it to the LLM to eliminate hallucinations and provide up-to-date domain answers.'
      },
      {
        id: 'py-4',
        question: 'Why is FastAPI faster and more modern compared to traditional Flask?',
        options: [
          'It is written in pure C language',
          'It natively supports asynchronous ASGI (`async`/`await`), Pydantic schema validation, and automatic OpenAPI Swagger documentation',
          'It does not require Python to run',
          'It only supports SQLite'
        ],
        correctAnswer: 1,
        explanation: 'FastAPI is built on Starlette and Pydantic with native async support, offering near-Go/Node performance and auto-generated API docs.'
      },
      {
        id: 'py-5',
        question: 'In Pandas, what is the fastest way to compute vector operations across columns instead of using standard `for` loops?',
        options: [
          'Iterating with `for index, row in df.iterrows():`',
          'Using native vectorized column operations (e.g. `df["col_c"] = df["col_a"] * df["col_b"]`) powered by NumPy C-extensions',
          'Calling `time.sleep()` between iterations',
          'Converting dataframe into a string'
        ],
        correctAnswer: 1,
        explanation: 'NumPy vectorized column operations execute compiled C code without Python bytecode loop overhead, running orders of magnitude faster.'
      },
      {
        id: 'py-6',
        question: 'What is the purpose of Python virtual environments (`venv` or `conda`)?',
        options: [
          'To run multiple Python versions simultaneously in the same file',
          'To create isolated dependency environments preventing package version conflicts between different projects',
          'To simulate virtual machines on cloud servers',
          'To backup source code to GitHub'
        ],
        correctAnswer: 1,
        explanation: 'Virtual environments isolate project-specific dependencies from system-wide packages.'
      },
      {
        id: 'py-7',
        question: 'What is Cosine Similarity used for in semantic search and AI matching?',
        options: [
          'Calculating triangle geometry for game graphics',
          'Measuring the cosine of the angle between two embedding vectors to determine semantic closeness regardless of magnitude',
          'Measuring internet bandwidth latency',
          'Encrypting user passwords'
        ],
        correctAnswer: 1,
        explanation: 'Cosine similarity scores how closely two vectors point in the same direction, widely used in semantic search and matching.'
      },
      {
        id: 'py-8',
        question: 'What does the `@property` decorator in a Python class accomplish?',
        options: [
          'It makes the class available in global scope',
          'It defines a getter method that can be accessed like an attribute without parentheses',
          'It connects the class to MongoDB Atlas',
          'It marks a method as deprecated'
        ],
        correctAnswer: 1,
        explanation: '@property allows defining methods that can be accessed as read-only attributes, enabling encapsulation and computed fields.'
      },
      {
        id: 'py-9',
        question: 'In PyTorch / TensorFlow, what is the role of the loss function during model training?',
        options: [
          'To count the number of epochs remaining',
          'To quantify the difference between model predictions and actual ground truth labels, guiding gradient descent backpropagation',
          'To compress the model weights onto disk',
          'To clean corrupt image files'
        ],
        correctAnswer: 1,
        explanation: 'The loss function computes error magnitude, and optimizers adjust network weights to minimize this loss via backpropagation.'
      },
      {
        id: 'py-10',
        question: 'What is Temperature parameter in Large Language Model (e.g., GPT/Gemini) inference?',
        options: [
          'The physical CPU temperature of the data center server',
          'A hyperparameter controlling output randomness: lower (0.0-0.2) produces deterministic answers, higher (0.7-1.0) produces creative/diverse answers',
          'The rate of token generation per second',
          'The maximum context window size'
        ],
        correctAnswer: 1,
        explanation: 'Temperature scales the logits before softmax; low temperature favors the highest probability tokens, while higher temperature increases variety.'
      }
    ]
  },
  {
    id: 'uiux-figma',
    name: 'UI/UX & Product Design',
    icon: 'Sparkles',
    color: 'from-pink-500 to-purple-600',
    description: 'Figma Auto-Layout, Design Systems, Typography Scale, WCAG Accessibility, and User Flow Prototyping.',
    timeLimitMinutes: 10,
    passingScorePercent: 80,
    badgeName: 'Certified UX/UI Designer',
    questions: [
      {
        id: 'ux-1',
        question: 'In Figma, what is the main advantage of Auto Layout v4 (Fill, Hug, Fixed)?',
        options: [
          'It automatically writes production React code with zero bugs',
          'It creates responsive dynamic frames that adapt fluidly as padding, gap, direction, and content change',
          'It exports 3D Blender models directly',
          'It generates automatic color palettes'
        ],
        correctAnswer: 1,
        explanation: 'Auto Layout allows building buttons, cards, and page layouts that automatically resize and reflow with changing content.'
      },
      {
        id: 'ux-2',
        question: 'According to WCAG 2.1 AA standards, what is the minimum contrast ratio required for normal body text against its background?',
        options: [
          '2:1',
          '4.5:1',
          '10:1',
          '1:1'
        ],
        correctAnswer: 1,
        explanation: 'WCAG AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (18pt or 14pt bold).'
      },
      {
        id: 'ux-3',
        question: 'What is the primary purpose of a Design System token architecture (Design Tokens)?',
        options: [
          'To generate crypto tokens for blockchain contracts',
          'To define single-source-of-truth variables (colors, spacing, typography) that synchronize across Figma and frontend codebases',
          'To replace Figma component libraries',
          'To automatically watermark PNG exports'
        ],
        correctAnswer: 1,
        explanation: 'Design tokens are platform-agnostic key-value pairs (e.g. primary-500: #6366F1) syncing design intent directly with code.'
      },
      {
        id: 'ux-4',
        question: 'What is Fitts’s Law in User Experience design?',
        options: [
          'A principle stating users prefer dark mode over light mode',
          'The time required to rapidly move to a target area is a function of the ratio between the distance to the target and the width of the target',
          'A law stating websites should load in less than 2 seconds',
          'A guideline stating navigation menus should contain max 5 items'
        ],
        correctAnswer: 1,
        explanation: 'Fitts’s Law emphasizes that important primary CTA buttons should be adequately large and placed within easy reaching distance.'
      },
      {
        id: 'ux-5',
        question: 'What is the 8pt Grid System standard widely used in digital product design?',
        options: [
          'Setting font sizes to multiples of 8 only',
          'Using increments of 8px (8, 16, 24, 32, 48, 64) for spacing, padding, margins, and component heights for consistent visual rhythm',
          'Limiting screens to 8 columns on desktop',
          'Limiting palettes to 8 colors total'
        ],
        correctAnswer: 1,
        explanation: 'An 8pt grid standardizes spatial hierarchy across varied screen densities and hardware scaling factors.'
      },
      {
        id: 'ux-6',
        question: 'What is the difference between Low-Fidelity wireframes and High-Fidelity interactive prototypes?',
        options: [
          'Low-fidelity focuses on structural layout and user flow; high-fidelity incorporates branding, micro-interactions, exact typography, and realistic data',
          'Low-fidelity is drawn on paper; high-fidelity can only be created in Photoshop',
          'Low-fidelity is for mobile; high-fidelity is for desktop',
          'There is no functional distinction'
        ],
        correctAnswer: 0,
        explanation: 'Low-fidelity validates architecture and hierarchy early on, while high-fidelity tests nuanced visual polish and interaction feel.'
      },
      {
        id: 'ux-7',
        question: 'What is Jakob’s Law in UX psychology?',
        options: [
          'Users spend most of their time on other sites, so they expect your site to work the same way as all the other sites they already know',
          'Users always click the top-right button first',
          'Designers should never use serif typography on the web',
          'Mobile interfaces should never use modal popups'
        ],
        correctAnswer: 0,
        explanation: 'Jakob’s Law emphasizes familiar mental models so users do not experience cognitive overload learning unconventional navigation.'
      },
      {
        id: 'ux-8',
        question: 'What are Figma Component Variants and Component Properties?',
        options: [
          'Features that allow grouping states (e.g., Default, Hover, Active, Disabled, Size) and controlling visibility/text swaps dynamically',
          'Plugins for 3D video editing',
          'Automated spelling and grammar checkers',
          'Tools to generate fake user profile photos'
        ],
        correctAnswer: 0,
        explanation: 'Component variants let designers consolidate state combinations into a clean, reusable component with intuitive property controls.'
      },
      {
        id: 'ux-9',
        question: 'What is the "Hick-Hyman Law" and how does it influence UI menu design?',
        options: [
          'The time it takes to make a decision increases logarithmically with the number and complexity of choices',
          'Users only read the first word of every heading',
          'Drop-shadows increase user trust by 20%',
          'Red buttons convert higher than green buttons'
        ],
        correctAnswer: 0,
        explanation: 'Hick’s Law dictates simplifying navigation and reducing redundant options so users decide quickly without cognitive paralysis.'
      },
      {
        id: 'ux-10',
        question: 'Why is Micro-copy (e.g. empty states, error messages, toast confirmations) vital to UX?',
        options: [
          'It improves Google Ads ranking directly',
          'It provides crucial feedback, guides user actions, clarifies errors empathetically, and reduces abandonment anxiety',
          'It allows developers to skip backend validation',
          'It is required by CSS specifications'
        ],
        correctAnswer: 1,
        explanation: 'Well-crafted micro-copy provides contextual clarity, reduces user confusion during edge cases, and instills product confidence.'
      }
    ]
  }
];
