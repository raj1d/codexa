import { PrismaClient, FileType, ResourceStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding complete GTU CSE & IT 8-Semester Curriculum...");

  // Ensure contributor user exists
  const contributor = await prisma.user.upsert({
    where: { email: "contributor@codexa.dev" },
    update: {},
    create: {
      email: "contributor@codexa.dev",
      name: "CODEXA Academic Council",
      role: "CONTRIBUTOR",
      githubUsername: "codexa-curriculum",
    },
  });

  // 1. All 8 Semesters
  const semestersData = [
    { number: 1, name: "Semester 1 — First Year Engineering Foundation" },
    { number: 2, name: "Semester 2 — Basic Engineering & Mathematics" },
    { number: 3, name: "Semester 3 — Core Computer Science Fundamentals" },
    { number: 4, name: "Semester 4 — Systems, Architecture & OOP" },
    { number: 5, name: "Semester 5 — Algorithms, Networks & Software Design" },
    { number: 6, name: "Semester 6 — Web Systems, Cloud & Advanced Tech" },
    { number: 7, name: "Semester 7 — Artificial Intelligence & Security" },
    { number: 8, name: "Semester 8 — Machine Learning, Big Data & Capstone" },
  ];

  const semesterMap: Record<number, string> = {};
  for (const s of semestersData) {
    const record = await prisma.semester.upsert({
      where: { number: s.number },
      update: { name: s.name },
      create: s,
    });
    semesterMap[s.number] = record.id;
  }

  // 2. Comprehensive GTU CSE & IT Subjects Curriculum
  const fullCurriculum = [
    // ── SEMESTER 1 ──
    {
      semester: 1,
      code: "3110014",
      name: "Mathematics - I (Calculus & Linear Algebra)",
      units: [
        { number: 1, name: "Indeterminate Forms, Improper Integrals & Taylor Series" },
        { number: 2, name: "Matrices, Rank, Gauss Elimination & Eigenvalues" },
        { number: 3, name: "Partial Derivatives, Maxima & Minima, Lagrange Multipliers" },
        { number: 4, name: "Multiple Integrals: Double & Triple Integrals with Area/Volume" },
        { number: 5, name: "Beta & Gamma Functions and Applications" },
      ],
    },
    {
      semester: 1,
      code: "3110003",
      name: "Programming for Problem Solving (C Language)",
      units: [
        { number: 1, name: "Algorithms, Flowcharts & Fundamentals of C Language" },
        { number: 2, name: "Control Structures: If-Else, Switch-Case & Loops" },
        { number: 3, name: "Arrays: 1D & 2D Matrices, String Manipulation Functions" },
        { number: 4, name: "Functions, Recursion & Storage Classes" },
        { number: 5, name: "Pointers, Dynamic Memory Allocation, Structures & File I/O" },
      ],
    },
    {
      semester: 1,
      code: "3110005",
      name: "Basic Electrical Engineering",
      units: [
        { number: 1, name: "DC Circuits: Ohm's Law, KCL, KVL, Thevenin & Norton Theorems" },
        { number: 2, name: "AC Fundamentals: RMS, Average Value, Form Factor & Phasors" },
        { number: 3, name: "Single Phase & Three Phase AC Circuits (Star/Delta)" },
        { number: 4, name: "Single Phase Transformers: Construction, EMF Equation & Losses" },
        { number: 5, name: "Electrical Machines, Safety & Earthing Systems" },
      ],
    },
    {
      semester: 1,
      code: "3110013",
      name: "Engineering Graphics & Design",
      units: [
        { number: 1, name: "Engineering Curves: Conics, Cycloids, Involutes & Spirals" },
        { number: 2, name: "Projections of Points and Straight Lines" },
        { number: 3, name: "Projections of Planes (Triangles, Polygons, Circles)" },
        { number: 4, name: "Projections of Solids (Prisms, Pyramids, Cylinders, Cones)" },
        { number: 5, name: "Orthographic & Isometric Projections with CAD Tools" },
      ],
    },

    // ── SEMESTER 2 ──
    {
      semester: 2,
      code: "3120005",
      name: "Mathematics - II (Vector Calculus & ODEs)",
      units: [
        { number: 1, name: "First Order First Degree Ordinary Differential Equations" },
        { number: 2, name: "Higher Order Linear Differential Equations with Constant Coeffs" },
        { number: 3, name: "Partial Differential Equations (PDE) & Separation of Variables" },
        { number: 4, name: "Vector Differential Calculus: Gradient, Divergence & Curl" },
        { number: 5, name: "Vector Integral Calculus: Green's, Stokes' & Gauss Divergence" },
      ],
    },
    {
      semester: 2,
      code: "3110016",
      name: "Basic Electronics",
      units: [
        { number: 1, name: "Semiconductor Diodes, PN Junction & Rectifiers" },
        { number: 2, name: "Bipolar Junction Transistors (BJT): Configurations & Biasing" },
        { number: 3, name: "Field Effect Transistors: JFET & MOSFET Characteristics" },
        { number: 4, name: "Operational Amplifiers (Op-Amps) and Analog Applications" },
        { number: 5, name: "Digital Logic Fundamentals, Binary Math & Logic Gates" },
      ],
    },
    {
      semester: 2,
      code: "3110002",
      name: "English & Professional Communication",
      units: [
        { number: 1, name: "Communication Theory: Barriers, Verbal & Non-Verbal Skills" },
        { number: 2, name: "Grammar, Vocabulary & Sentence Architecture" },
        { number: 3, name: "Technical Writing: Formal Letters, Emails & Reports" },
        { number: 4, name: "Reading Comprehension & Critical Analysis" },
        { number: 5, name: "Group Discussions, Presentations & Interview Skills" },
      ],
    },

    // ── SEMESTER 3 ──
    {
      semester: 3,
      code: "3130702",
      name: "Data Structures",
      units: [
        { number: 1, name: "Introduction to Data Structures, Asymptotic Analysis & Arrays" },
        { number: 2, name: "Linear Structures: Stacks, Queues, Deques & Applications" },
        { number: 3, name: "Linked Lists: Singly, Doubly, Circular & Header Lists" },
        { number: 4, name: "Trees: Binary Trees, Binary Search Trees (BST), AVL & Threaded Trees" },
        { number: 5, name: "Graphs (BFS/DFS, MST) & Hashing Collision Resolution" },
      ],
    },
    {
      semester: 3,
      code: "3130703",
      name: "Database Management Systems",
      units: [
        { number: 1, name: "Database Architecture, ER Modeling & Relational Model" },
        { number: 2, name: "Relational Algebra, Tuple Calculus & SQL Complex Queries" },
        { number: 3, name: "Functional Dependencies & Relational Normalization (1NF to BCNF)" },
        { number: 4, name: "Transaction Processing, ACID Properties, Concurrency & Recovery" },
        { number: 5, name: "Storage Architecture, B/B+ Tree Indexing & Query Optimization" },
      ],
    },
    {
      semester: 3,
      code: "3130704",
      name: "Digital Fundamentals",
      units: [
        { number: 1, name: "Number Systems, Binary Codes & Boolean Algebra Theorems" },
        { number: 2, name: "K-Map Minimization (up to 5 variables) & Quine-McCluskey" },
        { number: 3, name: "Combinational Circuits: Adders, Subtractors, Multiplexers, Decoders" },
        { number: 4, name: "Sequential Circuits: Latches, Flip-Flops, Counters & Shift Registers" },
        { number: 5, name: "Finite State Machines (Mealy/Moore) & Programmable Logic Devices" },
      ],
    },
    {
      semester: 3,
      code: "3130006",
      name: "Probability and Statistics",
      units: [
        { number: 1, name: "Probability Axioms, Conditional Probability & Bayes Theorem" },
        { number: 2, name: "Random Variables: Discrete, Continuous, PDF & CDF" },
        { number: 3, name: "Probability Distributions: Binomial, Poisson, Normal & Exponential" },
        { number: 4, name: "Correlation, Linear Regression & Curve Fitting" },
        { number: 5, name: "Hypothesis Testing: t-test, z-test, Chi-Square & ANOVA" },
      ],
    },

    // ── SEMESTER 4 ──
    {
      semester: 4,
      code: "3140702",
      name: "Operating Systems",
      units: [
        { number: 1, name: "OS Architecture, System Calls, Dual Mode & Process Management" },
        { number: 2, name: "CPU Scheduling Algorithms & Inter-Process Communication (IPC)" },
        { number: 3, name: "Process Synchronization: Critical Section, Semaphores & Mutex" },
        { number: 4, name: "Deadlocks: Prevention, Avoidance (Banker's) & Detection" },
        { number: 5, name: "Memory Management: Paging, Segmentation, Virtual Memory & File Systems" },
      ],
    },
    {
      semester: 4,
      code: "3140705",
      name: "Object Oriented Programming using Java",
      units: [
        { number: 1, name: "Java Environment (JVM/JDK), OOP Principles & Class Architecture" },
        { number: 2, name: "Inheritance, Abstract Classes, Interfaces & Packages" },
        { number: 3, name: "Exception Handling Mechanism & Multithreading Synchronization" },
        { number: 4, name: "Java Collections Framework: Lists, Sets, Maps & Generics" },
        { number: 5, name: "I/O Streams, Serialization, Lambda Expressions & Java FX Basics" },
      ],
    },
    {
      semester: 4,
      code: "3140707",
      name: "Computer Organization & Architecture",
      units: [
        { number: 1, name: "Register Transfer Language, Micro-operations & Bus Architecture" },
        { number: 2, name: "Central Processing Unit: Instruction Formats & Addressing Modes" },
        { number: 3, name: "Computer Arithmetic: Booth's Multiplication & Division Algorithms" },
        { number: 4, name: "Memory Organization: Cache Memory Mapping (Direct/Associative) & Virtual Memory" },
        { number: 5, name: "Input-Output Organization: DMA, Interrupts & Pipelining Hazards" },
      ],
    },
    {
      semester: 4,
      code: "3140708",
      name: "Discrete Mathematics",
      units: [
        { number: 1, name: "Set Theory, Relations, Equivalence Relations & Functions" },
        { number: 2, name: "Propositional Logic, Predicates, Quantifiers & Proof Methods" },
        { number: 3, name: "Algebraic Structures: Groups, Monoids, Semigroups & Rings" },
        { number: 4, name: "Lattices & Boolean Algebra" },
        { number: 5, name: "Graph Theory: Trees, Planarity, Coloring & Combinatorics" },
      ],
    },

    // ── SEMESTER 5 ──
    {
      semester: 5,
      code: "3150703",
      name: "Analysis and Design of Algorithms (ADA)",
      units: [
        { number: 1, name: "Asymptotic Notation, Recurrence Relations & Divide-and-Conquer" },
        { number: 2, name: "Greedy Algorithms: Huffman Coding, Fractional Knapsack, Prim/Kruskal" },
        { number: 3, name: "Dynamic Programming: 0/1 Knapsack, LCS, Matrix Chain, Floyd-Warshall" },
        { number: 4, name: "Backtracking (N-Queens, Subset Sum) & Branch-and-Bound" },
        { number: 5, name: "String Matching (KMP, Rabin-Karp) & NP-Completeness (P, NP, NP-Hard)" },
      ],
    },
    {
      semester: 5,
      code: "3150710",
      name: "Computer Networks",
      units: [
        { number: 1, name: "Network Architecture: OSI 7-Layer & TCP/IP Protocol Stack" },
        { number: 2, name: "Data Link Layer: Framing, Error Detection (CRC) & Sliding Window Protocols" },
        { number: 3, name: "Medium Access Control (CSMA/CD, CSMA/CA) & Ethernet Standards" },
        { number: 4, name: "Network Layer: IPv4/IPv6 Addressing, Subnetting & Routing (OSPF, BGP, RIP)" },
        { number: 5, name: "Transport & Application Layers: TCP/UDP, Congestion Control, DNS, HTTP, TLS" },
      ],
    },
    {
      semester: 5,
      code: "3150711",
      name: "Software Engineering",
      units: [
        { number: 1, name: "Software Development Lifecycles (SDLC): Waterfall, Spiral & Agile Scrum" },
        { number: 2, name: "Software Requirements Engineering, SRS Standards & Feasibility Study" },
        { number: 3, name: "Software Architecture, Modular Design, High Cohesion & Low Coupling" },
        { number: 4, name: "Object Oriented Design with UML Diagrams (Use Case, Class, Sequence)" },
        { number: 5, name: "Software Testing Strategies: White-Box, Black-Box, Unit & Regression Testing" },
      ],
    },
    {
      semester: 5,
      code: "3150714",
      name: "Cyber Security",
      units: [
        { number: 1, name: "Security Principles: CIA Triad, Threat Modeling & Attack Vectors" },
        { number: 2, name: "Symmetric Cryptography: DES, Triple DES & AES Algorithms" },
        { number: 3, name: "Asymmetric Cryptography: RSA, Diffie-Hellman & Digital Signatures" },
        { number: 4, name: "Network Security: Firewalls, IDS/IPS, VPN & SSL/TLS Handshake" },
        { number: 5, name: "Web Application Security: SQL Injection, XSS, CSRF & Cyber Laws (IT Act)" },
      ],
    },

    // ── SEMESTER 6 ──
    {
      semester: 6,
      code: "3160713",
      name: "Web Technology",
      units: [
        { number: 1, name: "Web Architecture, Semantic HTML5, Modern CSS3 & Flexbox/Grid" },
        { number: 2, name: "JavaScript ES6+: DOM Manipulation, Event Loop, Promises & Async/Await" },
        { number: 3, name: "Frontend Engineering with React: Components, Hooks, State & Routing" },
        { number: 4, name: "Server-Side Development with Node.js, Express & RESTful APIs" },
        { number: 5, name: "Fullstack Integration with MongoDB/PostgreSQL & JWT Authentication" },
      ],
    },
    {
      semester: 6,
      code: "3160707",
      name: "Advanced Java Programming",
      units: [
        { number: 1, name: "JDBC Database Connectivity, Prepared Statements & Transaction Control" },
        { number: 2, name: "Servlets Architecture, Session Tracking & Filters" },
        { number: 3, name: "JavaServer Pages (JSP), JSTL Tags & Custom Tag Libraries" },
        { number: 4, name: "Enterprise Java: Spring Core, Dependency Injection (DI) & Spring Boot" },
        { number: 5, name: "REST APIs with Spring Web & Hibernate ORM Mapping" },
      ],
    },
    {
      semester: 6,
      code: "3160714",
      name: "Data Warehousing & Data Mining",
      units: [
        { number: 1, name: "Data Warehouse Architecture, Multidimensional Schemas (Star/Snowflake)" },
        { number: 2, name: "ETL Pipeline: Extraction, Transformation, Cleaning & OLAP Operations" },
        { number: 3, name: "Data Preprocessing: Discretization, Normalization & Feature Selection" },
        { number: 4, name: "Association Rule Mining: Apriori Algorithm & FP-Tree Growth" },
        { number: 5, name: "Classification (Decision Trees, Naive Bayes) & Clustering (K-Means, DBSCAN)" },
      ],
    },
    {
      semester: 6,
      code: "3160715",
      name: "Software Project Management",
      units: [
        { number: 1, name: "Project Planning, Scope Definition & Work Breakdown Structure (WBS)" },
        { number: 2, name: "Effort & Cost Estimation: COCOMO Model, Function Point Analysis" },
        { number: 3, name: "Project Scheduling: CPM, PERT Charts & Gantt Schedules" },
        { number: 4, name: "Risk Management: Risk Identification, Assessment & Mitigation" },
        { number: 5, name: "Software Quality Assurance, CMMI Levels & Agile Monitoring" },
      ],
    },

    // ── SEMESTER 7 ──
    {
      semester: 7,
      code: "3170716",
      name: "Artificial Intelligence",
      units: [
        { number: 1, name: "Intelligent Agents, State Space Search, BFS, DFS & Heuristic Search (A*, AO*)" },
        { number: 2, name: "Adversarial Search: Minimax Algorithm & Alpha-Beta Pruning in Games" },
        { number: 3, name: "Knowledge Representation: First Order Predicate Logic & Inference Rules" },
        { number: 4, name: "Probabilistic Reasoning & Bayesian Networks under Uncertainty" },
        { number: 5, name: "Natural Language Processing (NLP) & Expert Systems Architecture" },
      ],
    },
    {
      semester: 7,
      code: "3170717",
      name: "Cloud Computing",
      units: [
        { number: 1, name: "Cloud Paradigms: IaaS, PaaS, SaaS, Public, Private & Hybrid Models" },
        { number: 2, name: "Virtualization Technologies: Hypervisors, Containers & Docker/K8s" },
        { number: 3, name: "Cloud Storage Architectures: Block, Object & Distributed File Systems" },
        { number: 4, name: "Cloud Security, IAM, Encryption at Rest & Compliance Standards" },
        { number: 5, name: "Serverless Computing, Microservices & AWS/Azure Cloud Infrastructure" },
      ],
    },
    {
      semester: 7,
      code: "3170724",
      name: "Mobile Application Development",
      units: [
        { number: 1, name: "Mobile Ecosystem: Architecture of Android & App Lifecycle" },
        { number: 2, name: "UI Design: Layouts, Views, Event Listeners & Material Design" },
        { number: 3, name: "Activities, Fragments, Intents & Android Background Services" },
        { number: 4, name: "Data Persistence: SQLite, Room Database & Shared Preferences" },
        { number: 5, name: "Cross-Platform Frameworks (Flutter, React Native) & REST API Integration" },
      ],
    },
    {
      semester: 7,
      code: "3170720",
      name: "Information & Network Security",
      units: [
        { number: 1, name: "Classical Cryptosystems: Substitution, Transposition & Stream Ciphers" },
        { number: 2, name: "Block Cipher Modes: ECB, CBC, CFB, OFB & CTR" },
        { number: 3, name: "Cryptographic Hash Functions (SHA-256, MD5) & Message Authentication Codes" },
        { number: 4, name: "Public Key Infrastructure (PKI), X.509 Certificates & Key Distribution" },
        { number: 5, name: "Wireless Security, Intrusion Prevention & Zero-Trust Architecture" },
      ],
    },

    // ── SEMESTER 8 ──
    {
      semester: 8,
      code: "3180701",
      name: "Machine Learning & Deep Learning",
      units: [
        { number: 1, name: "Supervised Learning: Linear/Logistic Regression & Support Vector Machines" },
        { number: 2, name: "Unsupervised Learning, Dimensionality Reduction (PCA, t-SNE)" },
        { number: 3, name: "Artificial Neural Networks (ANN): Forward/Backpropagation & Gradient Descent" },
        { number: 4, name: "Convolutional Neural Networks (CNN) for Computer Vision" },
        { number: 5, name: "Recurrent Neural Networks (RNN), LSTMs, Attention & Transformer Models" },
      ],
    },
    {
      semester: 8,
      code: "3180703",
      name: "Big Data Analytics",
      units: [
        { number: 1, name: "Big Data Dimensions (5 Vs), Distributed Computing Foundations" },
        { number: 2, name: "Hadoop Ecosystem: HDFS Architecture, NameNode, DataNode & YARN" },
        { number: 3, name: "MapReduce Framework: Mapper, Reducer, Shuffling & Sorting" },
        { number: 4, name: "Apache Spark: RDDs, DataFrames, Spark SQL & Streaming Analytics" },
        { number: 5, name: "NoSQL Databases (Cassandra, MongoDB, HBase) & Kafka Message Pipelines" },
      ],
    },
    {
      semester: 8,
      code: "3180707",
      name: "Internet of Things (IoT)",
      units: [
        { number: 1, name: "IoT Reference Architecture, Sensing & Actuation Principles" },
        { number: 2, name: "IoT Hardware: Arduino, ESP32, Raspberry Pi & GPIO Interfaces" },
        { number: 3, name: "IoT Communication Protocols: MQTT, CoAP, Zigbee & LoRaWAN" },
        { number: 4, name: "Cloud-IoT Integration, Edge Computing & Stream Data Processing" },
        { number: 5, name: "Smart City & Industrial IoT (IIoT) Case Studies & Security Controls" },
      ],
    },
  ];

  let totalSubjects = 0;
  let totalUnits = 0;
  let totalResources = 0;

  for (const item of fullCurriculum) {
    const semesterId = semesterMap[item.semester];
    if (!semesterId) continue;

    const subject = await prisma.subject.upsert({
      where: { code: item.code },
      update: {
        name: item.name,
        semesterId,
      },
      create: {
        code: item.code,
        name: item.name,
        semesterId,
      },
    });

    totalSubjects++;

    for (const u of item.units) {
      const unit = await prisma.unit.upsert({
        where: {
          subjectId_number: {
            subjectId: subject.id,
            number: u.number,
          },
        },
        update: { name: u.name },
        create: {
          subjectId: subject.id,
          number: u.number,
          name: u.name,
        },
      });

      totalUnits++;

      // Seed verified sample notes for each unit
      const existingResources = await prisma.resource.count({
        where: { unitId: unit.id },
      });

      if (existingResources === 0) {
        await prisma.resource.createMany({
          data: [
            {
              title: `${item.name} — Unit ${u.number} Comprehensive Lecture Notes`,
              description: `Handwritten and verified study notes covering ${u.name}. Includes diagrams, derivations, and exam questions.`,
              fileType: FileType.NOTES,
              fileUrl: "https://raw.githubusercontent.com/codexa-hub/assets/main/samples/notes-sample.pdf",
              semesterId,
              subjectId: subject.id,
              unitId: unit.id,
              uploaderId: contributor.id,
              status: ResourceStatus.APPROVED,
            },
            {
              title: `${item.name} — GTU Solved PYQ Question Bank`,
              description: `Solved university exam questions from 2021 to 2025 for Unit ${u.number}: ${u.name}.`,
              fileType: FileType.PYQ,
              fileUrl: "https://raw.githubusercontent.com/codexa-hub/assets/main/samples/pyq-sample.pdf",
              semesterId,
              subjectId: subject.id,
              unitId: unit.id,
              uploaderId: contributor.id,
              status: ResourceStatus.APPROVED,
            },
          ],
        });
        totalResources += 2;
      }
    }
  }

  console.log(`\n==================================================`);
  console.log(`Curriculum Seeding Complete!`);
  console.log(`- Semesters: 8 Semesters`);
  console.log(`- Subjects: ${totalSubjects} CSE & IT Subjects`);
  console.log(`- Units: ${totalUnits} Syllabus Units`);
  console.log(`- Study Files: ${totalResources} Verified Notes & PYQs`);
  console.log(`==================================================\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
