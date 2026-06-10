export interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

export interface GeneratedQuiz {
  id: string;
  name: string;
  subject: string;
  icon: string;
  questions: GeneratedQuestion[];
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: number;
  xpReward: number;
  generatedAt: string;
  aiGenerated: boolean;
}

// Comprehensive question banks by subject and topic
const questionBanks: Record<string, Record<string, GeneratedQuestion[]>> = {
  Mathematics: {
    "Calculus: Derivatives": [
      { id: "mcd1", question: "What is the derivative of x²?", options: ["x", "2x", "2x²", "x³"], correctIndex: 1, explanation: "Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x²) = 2x.", subject: "Mathematics", difficulty: "medium", topic: "Derivatives" },
      { id: "mcd2", question: "What is the derivative of sin(x)?", options: ["cos(x)", "-cos(x)", "tan(x)", "-sin(x)"], correctIndex: 0, explanation: "The derivative of sin(x) is cos(x).", subject: "Mathematics", difficulty: "easy", topic: "Derivatives" },
      { id: "mcd3", question: "What is d/dx(eˣ)?", options: ["x·eˣ", "eˣ", "eˣ⁺¹", "ln(eˣ)"], correctIndex: 1, explanation: "The derivative of eˣ is eˣ itself.", subject: "Mathematics", difficulty: "easy", topic: "Derivatives" },
      { id: "mcd4", question: "Using the chain rule, what is d/dx(sin(2x))?", options: ["cos(2x)", "2cos(2x)", "sin(2x)", "2sin(2x)"], correctIndex: 1, explanation: "Chain rule: d/dx[f(g(x))] = f'(g(x))·g'(x). So d/dx(sin(2x)) = cos(2x)·2 = 2cos(2x).", subject: "Mathematics", difficulty: "medium", topic: "Derivatives" },
      { id: "mcd5", question: "What is the derivative of ln(x)?", options: ["x", "1/x", "ln(x)/x", "1/x²"], correctIndex: 1, explanation: "d/dx(ln(x)) = 1/x.", subject: "Mathematics", difficulty: "easy", topic: "Derivatives" },
      { id: "mcd6", question: "What is the second derivative of x⁴?", options: ["4x³", "12x²", "12x", "4x²"], correctIndex: 1, explanation: "First derivative: 4x³. Second derivative: 12x².", subject: "Mathematics", difficulty: "medium", topic: "Derivatives" },
      { id: "mcd7", question: "What is d/dx(tan(x))?", options: ["sec(x)", "sec²(x)", "cot(x)", "cos²(x)"], correctIndex: 1, explanation: "d/dx(tan(x)) = sec²(x).", subject: "Mathematics", difficulty: "medium", topic: "Derivatives" },
      { id: "mcd8", question: "Using the product rule, what is d/dx(x·sin(x))?", options: ["sin(x)", "sin(x) + x·cos(x)", "x·cos(x)", "cos(x)"], correctIndex: 1, explanation: "Product rule: (fg)' = f'g + fg'. So d/dx(x·sin(x)) = 1·sin(x) + x·cos(x) = sin(x) + x·cos(x).", subject: "Mathematics", difficulty: "hard", topic: "Derivatives" },
      { id: "mcd9", question: "What is the derivative of x³ - 3x + 5?", options: ["3x² - 3", "3x² - 3x", "x² - 3", "3x - 3"], correctIndex: 0, explanation: "d/dx(x³ - 3x + 5) = 3x² - 3.", subject: "Mathematics", difficulty: "easy", topic: "Derivatives" },
      { id: "mcd10", question: "What is d/dx(e^(2x))?", options: ["2eˣ", "e^(2x)", "2e^(2x)", "e^(2x)/2"], correctIndex: 2, explanation: "Chain rule: d/dx(e^(2x)) = e^(2x)·2 = 2e^(2x).", subject: "Mathematics", difficulty: "medium", topic: "Derivatives" },
    ],
    "Calculus: Integrals": [
      { id: "mci1", question: "What is ∫2x dx?", options: ["x²", "x² + C", "2x²", "2x² + C"], correctIndex: 1, explanation: "Using the power rule for integration: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. So ∫2x dx = 2·x²/2 + C = x² + C.", subject: "Mathematics", difficulty: "easy", topic: "Integrals" },
      { id: "mci2", question: "What is ∫cos(x) dx?", options: ["-sin(x) + C", "sin(x) + C", "cos(x) + C", "tan(x) + C"], correctIndex: 1, explanation: "The integral of cos(x) is sin(x) + C.", subject: "Mathematics", difficulty: "easy", topic: "Integrals" },
      { id: "mci3", question: "What is ∫(1/x) dx?", options: ["x⁻² + C", "ln|x| + C", "1/x² + C", "eˣ + C"], correctIndex: 1, explanation: "The integral of 1/x is ln|x| + C.", subject: "Mathematics", difficulty: "easy", topic: "Integrals" },
      { id: "mci4", question: "What is ∫eˣ dx?", options: ["eˣ + C", "xeˣ + C", "eˣ/x + C", "e^(x+1) + C"], correctIndex: 0, explanation: "The integral of eˣ is eˣ + C.", subject: "Mathematics", difficulty: "easy", topic: "Integrals" },
      { id: "mci5", question: "Using substitution, what is ∫2x·cos(x²) dx?", options: ["sin(x²) + C", "cos(x²) + C", "2sin(x²) + C", "x²sin(x²) + C"], correctIndex: 0, explanation: "Let u = x², then du = 2x dx. So ∫2x·cos(x²) dx = ∫cos(u) du = sin(u) + C = sin(x²) + C.", subject: "Mathematics", difficulty: "medium", topic: "Integrals" },
      { id: "mci6", question: "What is ∫₀¹ x² dx?", options: ["1/2", "1/3", "1", "2/3"], correctIndex: 1, explanation: "∫₀¹ x² dx = [x³/3]₀¹ = 1/3 - 0 = 1/3.", subject: "Mathematics", difficulty: "medium", topic: "Integrals" },
      { id: "mci7", question: "What is the integral of sin(x)cos(x)?", options: ["sin²(x)/2 + C", "-cos²(x)/2 + C", "Both A and B", "sin(x)cos(x) + C"], correctIndex: 2, explanation: "Using the identity sin(x)cos(x) = sin(2x)/2, the integral is -cos(2x)/4 + C. Both A and B are valid antiderivatives differing by a constant.", subject: "Mathematics", difficulty: "hard", topic: "Integrals" },
      { id: "mci8", question: "What is ∫sec²(x) dx?", options: ["sec(x)tan(x) + C", "tan(x) + C", "-cot(x) + C", "tan²(x) + C"], correctIndex: 1, explanation: "Since d/dx(tan(x)) = sec²(x), we have ∫sec²(x) dx = tan(x) + C.", subject: "Mathematics", difficulty: "medium", topic: "Integrals" },
      { id: "mci9", question: "What is ∫₀^π sin(x) dx?", options: ["0", "1", "2", "π"], correctIndex: 2, explanation: "∫₀^π sin(x) dx = [-cos(x)]₀^π = -cos(π) - (-cos(0)) = -(-1) - (-1) = 1 + 1 = 2.", subject: "Mathematics", difficulty: "medium", topic: "Integrals" },
      { id: "mci10", question: "What is ∫x·eˣ dx (using integration by parts)?", options: ["eˣ(x-1) + C", "xeˣ + C", "eˣ(x+1) + C", "x²eˣ/2 + C"], correctIndex: 0, explanation: "Using integration by parts with u=x, dv=eˣdx: ∫x·eˣ dx = xeˣ - ∫eˣ dx = xeˣ - eˣ + C = eˣ(x-1) + C.", subject: "Mathematics", difficulty: "hard", topic: "Integrals" },
    ],
    "Linear Algebra": [
      { id: "mla1", question: "What is the determinant of a 2×2 matrix [[a,b],[c,d]]?", options: ["ab - cd", "ad - bc", "ac - bd", "ad + bc"], correctIndex: 1, explanation: "The determinant of a 2×2 matrix [[a,b],[c,d]] is ad - bc.", subject: "Mathematics", difficulty: "easy", topic: "Linear Algebra" },
      { id: "mla2", question: "What is the rank of a 3×3 identity matrix?", options: ["0", "1", "2", "3"], correctIndex: 3, explanation: "The identity matrix has full rank, so its rank equals its dimension.", subject: "Mathematics", difficulty: "easy", topic: "Linear Algebra" },
      { id: "mla3", question: "What are the eigenvalues of a diagonal matrix?", options: ["All zero", "All one", "The diagonal entries", "Cannot be determined"], correctIndex: 2, explanation: "The eigenvalues of a diagonal matrix are simply its diagonal entries.", subject: "Mathematics", difficulty: "medium", topic: "Linear Algebra" },
      { id: "mla4", question: "If Av = λv, what is v called?", options: ["Null vector", "Eigenvector", "Basis vector", "Unit vector"], correctIndex: 1, explanation: "If Av = λv for a non-zero vector v, then v is an eigenvector of A with eigenvalue λ.", subject: "Mathematics", difficulty: "easy", topic: "Linear Algebra" },
      { id: "mla5", question: "What is the trace of a matrix?", options: ["Product of eigenvalues", "Sum of diagonal elements", "Sum of all elements", "Number of rows"], correctIndex: 1, explanation: "The trace of a matrix is the sum of its diagonal elements, which also equals the sum of its eigenvalues.", subject: "Mathematics", difficulty: "medium", topic: "Linear Algebra" },
    ],
    "Probability & Statistics": [
      { id: "mps1", question: "What is P(A|B) according to Bayes' theorem?", options: ["P(B|A)·P(A)/P(B)", "P(A)·P(B)", "P(A∪B) - P(A∩B)", "1 - P(A')"], correctIndex: 0, explanation: "Bayes' theorem: P(A|B) = P(B|A)·P(A)/P(B).", subject: "Mathematics", difficulty: "medium", topic: "Probability" },
      { id: "mps2", question: "What is the expected value of a fair six-sided die?", options: ["3", "3.5", "4", "4.5"], correctIndex: 1, explanation: "E(X) = (1+2+3+4+5+6)/6 = 21/6 = 3.5.", subject: "Mathematics", difficulty: "easy", topic: "Probability" },
      { id: "mps3", question: "What is the standard deviation of a normal distribution?", options: ["Always 0", "Always 1", "Depends on the distribution", "Cannot be negative"], correctIndex: 2, explanation: "The standard deviation depends on the specific normal distribution. The standard normal has σ=1, but general normals can have any positive σ.", subject: "Mathematics", difficulty: "medium", topic: "Probability" },
      { id: "mps4", question: "What does the Central Limit Theorem state?", options: ["Sample mean equals population mean", "Sample distribution approaches normal as n increases", "All distributions are normal", "Variance decreases with sample size"], correctIndex: 1, explanation: "The CLT states that the sampling distribution of the mean approaches a normal distribution as the sample size increases, regardless of the population distribution.", subject: "Mathematics", difficulty: "medium", topic: "Statistics" },
      { id: "mps5", question: "If two events A and B are independent, what is P(A∩B)?", options: ["P(A) + P(B)", "P(A) · P(B)", "P(A|B) · P(B)", "P(A) / P(B)"], correctIndex: 1, explanation: "For independent events, P(A∩B) = P(A) · P(B).", subject: "Mathematics", difficulty: "easy", topic: "Probability" },
    ],
  },
  Physics: {
    "Quantum Mechanics": [
      { id: "pqm1", question: "What does the Heisenberg Uncertainty Principle state?", options: ["Energy is conserved", "Position and momentum cannot both be precisely known", "Electrons orbit in fixed paths", "Light is both a wave and particle"], correctIndex: 1, explanation: "The Heisenberg Uncertainty Principle states that we cannot simultaneously know both the exact position and exact momentum of a particle.", subject: "Physics", difficulty: "medium", topic: "Quantum Mechanics" },
      { id: "pqm2", question: "What is Planck's constant approximately equal to?", options: ["6.626 × 10⁻³⁴ J·s", "3.0 × 10⁸ m/s", "1.6 × 10⁻¹⁹ C", "9.8 m/s²"], correctIndex: 0, explanation: "Planck's constant h ≈ 6.626 × 10⁻³⁴ J·s.", subject: "Physics", difficulty: "easy", topic: "Quantum Mechanics" },
      { id: "pqm3", question: "What is wave-particle duality?", options: ["Waves always have particles", "Light and matter exhibit both wave and particle properties", "Particles create waves when moving", "Waves destroy particles"], correctIndex: 1, explanation: "Wave-particle duality is the concept that quantum entities exhibit both wave-like and particle-like properties.", subject: "Physics", difficulty: "easy", topic: "Quantum Mechanics" },
      { id: "pqm4", question: "What does the Schrödinger equation describe?", options: ["Nuclear fusion", "Quantum state evolution over time", "Gravitational waves", "Electromagnetic radiation"], correctIndex: 1, explanation: "The Schrödinger equation describes how the quantum state of a system evolves over time.", subject: "Physics", difficulty: "medium", topic: "Quantum Mechanics" },
      { id: "pqm5", question: "What is quantum superposition?", options: ["Adding quantum states", "A system existing in multiple states simultaneously until measured", "Stacking quantum particles", "Measuring quantum properties"], correctIndex: 1, explanation: "Quantum superposition means a quantum system can exist in multiple states at once until it is measured.", subject: "Physics", difficulty: "medium", topic: "Quantum Mechanics" },
      { id: "pqm6", question: "What is quantum entanglement?", options: ["Particles spinning together", "Correlated quantum states regardless of distance", "Particles colliding", "Quantum particles merging"], correctIndex: 1, explanation: "Quantum entanglement is a phenomenon where two particles become correlated and the state of one instantly influences the other, regardless of distance.", subject: "Physics", difficulty: "hard", topic: "Quantum Mechanics" },
      { id: "pqm7", question: "What is the photoelectric effect?", options: ["Electricity from photos", "Electron emission from material when light hits it", "Light produced by electricity", "Reflection of light"], correctIndex: 1, explanation: "The photoelectric effect is the emission of electrons when electromagnetic radiation hits a material.", subject: "Physics", difficulty: "easy", topic: "Quantum Mechanics" },
      { id: "pqm8", question: "What is a photon?", options: ["A particle with mass", "A quantum of electromagnetic radiation", "An electron with energy", "A neutron"], correctIndex: 1, explanation: "A photon is a quantum of electromagnetic radiation — a massless particle that carries electromagnetic force.", subject: "Physics", difficulty: "easy", topic: "Quantum Mechanics" },
      { id: "pqm9", question: "What is quantum tunneling?", options: ["Tunneling through walls", "Particle passing through a classically forbidden energy barrier", "Creating tunnels in atoms", "Moving through black holes"], correctIndex: 1, explanation: "Quantum tunneling is the quantum mechanical phenomenon where a particle passes through a barrier that it classically could not surmount.", subject: "Physics", difficulty: "hard", topic: "Quantum Mechanics" },
      { id: "pqm10", question: "What is the Pauli Exclusion Principle?", options: ["No two fermions can occupy the same quantum state", "All particles spin the same way", "Energy is always conserved", "Protons cannot touch electrons"], correctIndex: 0, explanation: "The Pauli Exclusion Principle states that no two identical fermions can occupy the same quantum state simultaneously.", subject: "Physics", difficulty: "hard", topic: "Quantum Mechanics" },
    ],
    "Classical Mechanics": [
      { id: "pcm1", question: "What is Newton's Second Law?", options: ["F = ma", "F = mv", "F = m/a", "F = ma²"], correctIndex: 0, explanation: "Newton's Second Law states that force equals mass times acceleration: F = ma.", subject: "Physics", difficulty: "easy", topic: "Classical Mechanics" },
      { id: "pcm2", question: "What is the kinetic energy formula?", options: ["mv", "½mv²", "mgh", "mv²"], correctIndex: 1, explanation: "Kinetic energy KE = ½mv², where m is mass and v is velocity.", subject: "Physics", difficulty: "easy", topic: "Classical Mechanics" },
      { id: "pcm3", question: "What is the acceleration due to gravity on Earth?", options: ["8.9 m/s²", "9.8 m/s²", "10.8 m/s²", "11.8 m/s²"], correctIndex: 1, explanation: "The standard acceleration due to gravity on Earth is approximately 9.8 m/s².", subject: "Physics", difficulty: "easy", topic: "Classical Mechanics" },
      { id: "pcm4", question: "What does conservation of angular momentum imply?", options: ["ω is constant", "L = Iω is constant in absence of external torque", "Energy is conserved", "Momentum is conserved"], correctIndex: 1, explanation: "Angular momentum L = Iω is conserved when no external torque acts on the system.", subject: "Physics", difficulty: "medium", topic: "Classical Mechanics" },
      { id: "pcm5", question: "What is the period of a simple pendulum (small angle)?", options: ["2π√(g/L)", "2π√(L/g)", "2π√(m/g)", "2π√(L/m)"], correctIndex: 1, explanation: "For small angles, T = 2π√(L/g), where L is the length and g is gravitational acceleration.", subject: "Physics", difficulty: "medium", topic: "Classical Mechanics" },
    ],
    "Electromagnetism": [
      { id: "pem1", question: "What is Coulomb's Law?", options: ["F = kq₁q₂/r²", "F = kq₁q₂/r", "F = q₁q₂/r²", "F = kq/r²"], correctIndex: 0, explanation: "Coulomb's Law: F = kq₁q₂/r², where k is Coulomb's constant, q₁ and q₂ are charges, and r is the distance.", subject: "Physics", difficulty: "easy", topic: "Electromagnetism" },
      { id: "pem2", question: "What is the speed of light in vacuum?", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10¹² m/s"], correctIndex: 1, explanation: "The speed of light in vacuum is approximately 3×10⁸ m/s (299,792,458 m/s exactly).", subject: "Physics", difficulty: "easy", topic: "Electromagnetism" },
      { id: "pem3", question: "What does Gauss's Law relate?", options: ["Electric field to charge", "Magnetic field to current", "Electric flux to enclosed charge", "Force to acceleration"], correctIndex: 2, explanation: "Gauss's Law states that the electric flux through a closed surface is proportional to the enclosed charge.", subject: "Physics", difficulty: "medium", topic: "Electromagnetism" },
      { id: "pem4", question: "What is the unit of magnetic field?", options: ["Tesla", "Weber", "Henry", "Ampere"], correctIndex: 0, explanation: "The unit of magnetic field (B) is the Tesla (T).", subject: "Physics", difficulty: "easy", topic: "Electromagnetism" },
      { id: "pem5", question: "What does Faraday's Law describe?", options: ["Electric field from charge", "Induced EMF from changing magnetic flux", "Magnetic field from current", "Force on moving charge"], correctIndex: 1, explanation: "Faraday's Law states that a changing magnetic flux induces an electromotive force (EMF).", subject: "Physics", difficulty: "medium", topic: "Electromagnetism" },
    ],
    "Thermodynamics": [
      { id: "ptd1", question: "What is the First Law of Thermodynamics?", options: ["Energy cannot be created or destroyed", "Entropy always increases", "Heat flows from hot to cold", "No process is 100% efficient"], correctIndex: 0, explanation: "The First Law states that energy is conserved — it cannot be created or destroyed, only transferred.", subject: "Physics", difficulty: "easy", topic: "Thermodynamics" },
      { id: "ptd2", question: "What is absolute zero in Celsius?", options: ["-273.15°C", "0°C", "-100°C", "-459.67°C"], correctIndex: 0, explanation: "Absolute zero is -273.15°C (0 K), the lowest possible temperature.", subject: "Physics", difficulty: "easy", topic: "Thermodynamics" },
      { id: "ptd3", question: "What does the Second Law of Thermodynamics state?", options: ["Energy is conserved", "Entropy of an isolated system never decreases", "Heat cannot be converted to work", "Temperature is absolute"], correctIndex: 1, explanation: "The Second Law states that the total entropy of an isolated system can only increase over time.", subject: "Physics", difficulty: "medium", topic: "Thermodynamics" },
      { id: "ptd4", question: "What is the efficiency of a Carnot engine?", options: ["100%", "1 - T_cold/T_hot", "T_hot/T_cold", "T_cold/T_hot"], correctIndex: 1, explanation: "The Carnot efficiency is η = 1 - T_cold/T_hot, where temperatures are in Kelvin.", subject: "Physics", difficulty: "hard", topic: "Thermodynamics" },
      { id: "ptd5", question: "What is specific heat capacity?", options: ["Energy to change temperature by 1K per unit mass", "Total heat in a system", "Rate of heat transfer", "Temperature change per unit energy"], correctIndex: 0, explanation: "Specific heat capacity is the amount of energy required to raise 1 kg of a substance by 1 Kelvin.", subject: "Physics", difficulty: "easy", topic: "Thermodynamics" },
    ],
  },
  "Computer Science": {
    "Algorithms & Data Structures": [
      { id: "cas1", question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctIndex: 1, explanation: "Binary search halves the search space each step, giving O(log n) time complexity.", subject: "Computer Science", difficulty: "easy", topic: "Algorithms" },
      { id: "cas2", question: "Which data structure uses LIFO ordering?", options: ["Queue", "Stack", "Array", "Linked List"], correctIndex: 1, explanation: "A stack uses Last In, First Out (LIFO) ordering.", subject: "Computer Science", difficulty: "easy", topic: "Data Structures" },
      { id: "cas3", question: "What is the average time complexity of QuickSort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctIndex: 1, explanation: "QuickSort has an average time complexity of O(n log n).", subject: "Computer Science", difficulty: "medium", topic: "Algorithms" },
      { id: "cas4", question: "What is a hash table's average lookup time?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correctIndex: 2, explanation: "Hash tables provide O(1) average-case time complexity for lookups.", subject: "Computer Science", difficulty: "easy", topic: "Data Structures" },
      { id: "cas5", question: "Which algorithm is used for shortest path in a weighted graph?", options: ["BFS", "DFS", "Dijkstra's Algorithm", "Merge Sort"], correctIndex: 2, explanation: "Dijkstra's Algorithm finds the shortest path in a weighted graph with non-negative edge weights.", subject: "Computer Science", difficulty: "medium", topic: "Algorithms" },
      { id: "cas6", question: "What is the space complexity of merge sort?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctIndex: 2, explanation: "Merge sort requires O(n) auxiliary space for the merging step.", subject: "Computer Science", difficulty: "medium", topic: "Algorithms" },
      { id: "cas7", question: "What is dynamic programming?", options: ["Programming with variables", "Optimization by breaking problems into overlapping subproblems", "A type of loop", "Runtime code generation"], correctIndex: 1, explanation: "Dynamic programming solves complex problems by breaking them into overlapping subproblems and storing their solutions.", subject: "Computer Science", difficulty: "medium", topic: "Algorithms" },
      { id: "cas8", question: "What is the height of a balanced BST with n nodes?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correctIndex: 1, explanation: "A balanced binary search tree has height O(log n).", subject: "Computer Science", difficulty: "medium", topic: "Data Structures" },
      { id: "cas9", question: "Which sorting algorithm is stable?", options: ["QuickSort", "HeapSort", "MergeSort", "Selection Sort"], correctIndex: 2, explanation: "MergeSort is a stable sorting algorithm — it preserves the relative order of equal elements.", subject: "Computer Science", difficulty: "hard", topic: "Algorithms" },
      { id: "cas10", question: "What is the Bellman-Ford algorithm used for?", options: ["Sorting", "Finding shortest paths (handles negative weights)", "Finding cycles", "Binary search"], correctIndex: 1, explanation: "Bellman-Ford finds shortest paths from a single source and can handle negative edge weights.", subject: "Computer Science", difficulty: "hard", topic: "Algorithms" },
    ],
    "Operating Systems": [
      { id: "cos1", question: "What is a process?", options: ["A running program", "A file on disk", "A CPU instruction", "A memory address"], correctIndex: 0, explanation: "A process is an instance of a running program with its own memory space and resources.", subject: "Computer Science", difficulty: "easy", topic: "Operating Systems" },
      { id: "cos2", question: "What is the purpose of a semaphore?", options: ["Memory allocation", "Process synchronization", "File management", "User authentication"], correctIndex: 1, explanation: "Semaphores are used for process synchronization to control access to shared resources.", subject: "Computer Science", difficulty: "medium", topic: "Operating Systems" },
      { id: "cos3", question: "What is virtual memory?", options: ["RAM expansion", "Using disk as extended RAM", "Cloud memory", "Cache memory"], correctIndex: 1, explanation: "Virtual memory uses disk space to extend the apparent size of physical RAM.", subject: "Computer Science", difficulty: "medium", topic: "Operating Systems" },
      { id: "cos4", question: "What is a deadlock?", options: ["Program crash", "Circular waiting for resources", "Memory overflow", "CPU idle"], correctIndex: 1, explanation: "Deadlock occurs when processes are stuck waiting for each other to release resources.", subject: "Computer Science", difficulty: "medium", topic: "Operating Systems" },
      { id: "cos5", question: "What is the difference between a thread and a process?", options: ["No difference", "Threads share memory, processes don't", "Processes are faster", "Threads use more memory"], correctIndex: 1, explanation: "Threads within the same process share memory and resources, while processes have separate memory spaces.", subject: "Computer Science", difficulty: "easy", topic: "Operating Systems" },
    ],
    "Databases": [
      { id: "cdb1", question: "What does SQL stand for?", options: ["Simple Query Language", "Structured Query Language", "Standard Query Logic", "System Query Language"], correctIndex: 1, explanation: "SQL stands for Structured Query Language.", subject: "Computer Science", difficulty: "easy", topic: "Databases" },
      { id: "cdb2", question: "What is a primary key?", options: ["A foreign reference", "A unique identifier for each row", "An index", "A data type"], correctIndex: 1, explanation: "A primary key uniquely identifies each record in a database table.", subject: "Computer Science", difficulty: "easy", topic: "Databases" },
      { id: "cdb3", question: "What is database normalization?", options: ["Adding more data", "Reducing redundancy by organizing data", "Encrypting data", "Backing up data"], correctIndex: 1, explanation: "Normalization is the process of organizing data to reduce redundancy and improve data integrity.", subject: "Computer Science", difficulty: "medium", topic: "Databases" },
      { id: "cdb4", question: "What is an ACID transaction?", options: ["A chemical transaction", "Atomicity, Consistency, Isolation, Durability", "A database type", "A query language"], correctIndex: 1, explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability — properties that guarantee reliable database transactions.", subject: "Computer Science", difficulty: "medium", topic: "Databases" },
      { id: "cdb5", question: "What is the N+1 query problem?", options: ["Too many columns", "Executing one query for each row in a result set", "Table too large", "Too many joins"], correctIndex: 1, explanation: "The N+1 problem occurs when code executes 1 query to fetch N rows, then N additional queries — one per row.", subject: "Computer Science", difficulty: "hard", topic: "Databases" },
    ],
    "Networking": [
      { id: "cnw1", question: "What does HTTP stand for?", options: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "HyperText Transmission Process", "Home Tool Transfer Protocol"], correctIndex: 0, explanation: "HTTP stands for HyperText Transfer Protocol.", subject: "Computer Science", difficulty: "easy", topic: "Networking" },
      { id: "cnw2", question: "What port does HTTPS typically use?", options: ["80", "443", "8080", "3000"], correctIndex: 1, explanation: "HTTPS uses port 443 by default.", subject: "Computer Science", difficulty: "easy", topic: "Networking" },
      { id: "cnw3", question: "What is DNS?", options: ["Data Network Security", "Domain Name System", "Dynamic Network Service", "Direct Node Setup"], correctIndex: 1, explanation: "DNS (Domain Name System) translates domain names to IP addresses.", subject: "Computer Science", difficulty: "easy", topic: "Networking" },
      { id: "cnw4", question: "What is the OSI model?", options: ["A programming language", "A 7-layer network communication model", "A database standard", "An operating system"], correctIndex: 1, explanation: "The OSI model defines 7 layers of network communication: Physical, Data Link, Network, Transport, Session, Presentation, Application.", subject: "Computer Science", difficulty: "medium", topic: "Networking" },
      { id: "cnw5", question: "What is the difference between TCP and UDP?", options: ["No difference", "TCP is reliable and ordered, UDP is fast but unreliable", "TCP is faster", "UDP uses more bandwidth"], correctIndex: 1, explanation: "TCP provides reliable, ordered delivery with error checking. UDP is faster but doesn't guarantee delivery or ordering.", subject: "Computer Science", difficulty: "medium", topic: "Networking" },
    ],
  },
  Biology: {
    "Cell Biology": [
      { id: "bcb1", question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"], correctIndex: 1, explanation: "Mitochondria are known as the powerhouse of the cell because they produce ATP through cellular respiration.", subject: "Biology", difficulty: "easy", topic: "Cell Biology" },
      { id: "bcb2", question: "What is the function of ribosomes?", options: ["Energy production", "Protein synthesis", "DNA replication", "Cell division"], correctIndex: 1, explanation: "Ribosomes are responsible for protein synthesis — translating mRNA into amino acid sequences.", subject: "Biology", difficulty: "easy", topic: "Cell Biology" },
      { id: "bcb3", question: "What is the cell membrane primarily composed of?", options: ["Proteins only", "Phospholipid bilayer", "DNA", "Carbohydrates"], correctIndex: 1, explanation: "The cell membrane is primarily composed of a phospholipid bilayer with embedded proteins.", subject: "Biology", difficulty: "easy", topic: "Cell Biology" },
      { id: "bcb4", question: "What is osmosis?", options: ["Active transport of ions", "Movement of water across a semipermeable membrane", "Protein synthesis", "DNA replication"], correctIndex: 1, explanation: "Osmosis is the movement of water molecules from an area of low solute concentration to high solute concentration across a semipermeable membrane.", subject: "Biology", difficulty: "medium", topic: "Cell Biology" },
      { id: "bcb5", question: "What is the function of the endoplasmic reticulum?", options: ["ATP production", "Protein and lipid synthesis", "Cell division", "DNA storage"], correctIndex: 1, explanation: "The ER is involved in protein synthesis (rough ER) and lipid synthesis (smooth ER).", subject: "Biology", difficulty: "medium", topic: "Cell Biology" },
    ],
    "Genetics": [
      { id: "bg1", question: "What does DNA stand for?", options: ["Deoxyribonucleic Acid", "Dinitrogen Acid", "Deoxyribose Nucleic Acid", "Dynamic Nuclear Acid"], correctIndex: 0, explanation: "DNA stands for Deoxyribonucleic Acid.", subject: "Biology", difficulty: "easy", topic: "Genetics" },
      { id: "bg2", question: "How many base pairs does a codon contain?", options: ["1", "2", "3", "4"], correctIndex: 2, explanation: "A codon consists of 3 nucleotide base pairs that code for a specific amino acid.", subject: "Biology", difficulty: "easy", topic: "Genetics" },
      { id: "bg3", question: "What is the process of DNA replication?", options: ["Transcription", "Copying DNA to make identical DNA molecules", "Translation", "Mutation"], correctIndex: 1, explanation: "DNA replication is the process of producing two identical copies of DNA from one original molecule.", subject: "Biology", difficulty: "easy", topic: "Genetics" },
      { id: "bg4", question: "What is a dominant allele?", options: ["An allele that is always expressed", "An allele expressed only when homozygous", "An allele that prevents other alleles", "An allele on the X chromosome"], correctIndex: 0, explanation: "A dominant allele is expressed even when only one copy is present (heterozygous state).", subject: "Biology", difficulty: "medium", topic: "Genetics" },
      { id: "bg5", question: "What enzyme unwinds DNA during replication?", options: ["RNA polymerase", "DNA helicase", "DNA ligase", "DNA polymerase"], correctIndex: 1, explanation: "DNA helicase unwinds and separates the two strands of the DNA double helix during replication.", subject: "Biology", difficulty: "medium", topic: "Genetics" },
    ],
    "Ecology": [
      { id: "be1", question: "What is an ecosystem?", options: ["A single organism", "Interacting community and physical environment", "A food chain only", "A group of same species"], correctIndex: 1, explanation: "An ecosystem includes all living organisms in an area and their interactions with the physical environment.", subject: "Biology", difficulty: "easy", topic: "Ecology" },
      { id: "be2", question: "What is a food chain?", options: ["A cooking recipe", "A linear sequence of energy transfer between organisms", "A type of DNA", "A weather pattern"], correctIndex: 1, explanation: "A food chain shows the linear transfer of energy from producers to consumers.", subject: "Biology", difficulty: "easy", topic: "Ecology" },
      { id: "be3", question: "What is biodiversity?", options: ["Number of species in one area", "Variety of life in all forms", "A type of cell", "A genetic mutation"], correctIndex: 1, explanation: "Biodiversity refers to the variety of life in all its forms — species, genetic, and ecosystem diversity.", subject: "Biology", difficulty: "easy", topic: "Ecology" },
      { id: "be4", question: "What is a producer in an ecosystem?", options: ["A consumer", "An organism that makes its own food (e.g., plants)", "A decomposer", "A predator"], correctIndex: 1, explanation: "Producers (autotrophs) make their own food through photosynthesis or chemosynthesis.", subject: "Biology", difficulty: "easy", topic: "Ecology" },
      { id: "be5", question: "What is the greenhouse effect?", options: ["Growth of plants in a greenhouse", "Trapping of heat by atmospheric gases", "A type of photosynthesis", "A climate cooling mechanism"], correctIndex: 1, explanation: "The greenhouse effect is the trapping of heat by gases like CO₂ and methane in the atmosphere.", subject: "Biology", difficulty: "medium", topic: "Ecology" },
    ],
    "Human Biology": [
      { id: "bhb1", question: "How many chambers does the human heart have?", options: ["2", "3", "4", "5"], correctIndex: 2, explanation: "The human heart has 4 chambers: left atrium, right atrium, left ventricle, and right ventricle.", subject: "Biology", difficulty: "easy", topic: "Human Biology" },
      { id: "bhb2", question: "What is the largest organ in the human body?", options: ["Heart", "Liver", "Brain", "Skin"], correctIndex: 3, explanation: "The skin is the largest organ, covering about 20 square feet in adults.", subject: "Biology", difficulty: "easy", topic: "Human Biology" },
      { id: "bhb3", question: "What is the function of white blood cells?", options: ["Carry oxygen", "Fight infections", "Clot blood", "Carry nutrients"], correctIndex: 1, explanation: "White blood cells are part of the immune system and fight infections and diseases.", subject: "Biology", difficulty: "easy", topic: "Human Biology" },
      { id: "bhb4", question: "How many pairs of chromosomes do humans have?", options: ["22", "23", "24", "46"], correctIndex: 1, explanation: "Humans have 23 pairs of chromosomes (22 autosomes + 1 pair of sex chromosomes).", subject: "Biology", difficulty: "easy", topic: "Human Biology" },
      { id: "bhb5", question: "What organ filters blood in the human body?", options: ["Heart", "Lungs", "Kidneys", "Spleen"], correctIndex: 2, explanation: "The kidneys filter blood, removing waste products and excess fluids to produce urine.", subject: "Biology", difficulty: "easy", topic: "Human Biology" },
    ],
  },
  Chemistry: {
    "General Chemistry": [
      { id: "cgc1", question: "What is the atomic number of carbon?", options: ["4", "6", "8", "12"], correctIndex: 1, explanation: "Carbon has atomic number 6, meaning it has 6 protons.", subject: "Chemistry", difficulty: "easy", topic: "General Chemistry" },
      { id: "cgc2", question: "What is Avogadro's number?", options: ["6.022 × 10²³", "3.0 × 10⁸", "6.626 × 10⁻³⁴", "1.6 × 10⁻¹⁹"], correctIndex: 0, explanation: "Avogadro's number is approximately 6.022 × 10²³ particles per mole.", subject: "Chemistry", difficulty: "easy", topic: "General Chemistry" },
      { id: "cgc3", question: "What is the pH of a neutral solution?", options: ["0", "7", "14", "1"], correctIndex: 1, explanation: "A neutral solution has a pH of 7.", subject: "Chemistry", difficulty: "easy", topic: "General Chemistry" },
      { id: "cgc4", question: "What is the chemical formula for water?", options: ["H₂O₂", "HO₂", "H₂O", "OH"], correctIndex: 2, explanation: "Water is H₂O — two hydrogen atoms bonded to one oxygen atom.", subject: "Chemistry", difficulty: "easy", topic: "General Chemistry" },
      { id: "cgc5", question: "What type of bond forms between a metal and non-metal?", options: ["Covalent", "Ionic", "Metallic", "Hydrogen"], correctIndex: 1, explanation: "Ionic bonds form when a metal transfers electrons to a non-metal.", subject: "Chemistry", difficulty: "easy", topic: "General Chemistry" },
    ],
    "Organic Chemistry": [
      { id: "coc1", question: "What is the simplest organic compound?", options: ["Ethanol", "Methane (CH₄)", "Benzene", "Acetic acid"], correctIndex: 1, explanation: "Methane (CH₄) is the simplest organic compound with one carbon atom.", subject: "Chemistry", difficulty: "easy", topic: "Organic Chemistry" },
      { id: "coc2", question: "What functional group defines an alcohol?", options: ["-COOH", "-OH", "-CHO", "-NH₂"], correctIndex: 1, explanation: "Alcohols contain the hydroxyl (-OH) functional group.", subject: "Chemistry", difficulty: "easy", topic: "Organic Chemistry" },
      { id: "coc3", question: "What is the hybridization of carbon in methane?", options: ["sp", "sp²", "sp³", "sp³d"], correctIndex: 2, explanation: "Carbon in methane is sp³ hybridized, forming 4 equivalent bonds.", subject: "Chemistry", difficulty: "medium", topic: "Organic Chemistry" },
      { id: "coc4", question: "What type of reaction adds water across a double bond?", options: ["Dehydration", "Hydration", "Hydrogenation", "Oxidation"], correctIndex: 1, explanation: "Hydration adds water (H-OH) across a double bond, converting alkenes to alcohols.", subject: "Chemistry", difficulty: "medium", topic: "Organic Chemistry" },
      { id: "coc5", question: "What is a nucleophile?", options: ["An electron-pair donor", "An electron-pair acceptor", "A proton donor", "A proton acceptor"], correctIndex: 0, explanation: "A nucleophile is an electron-rich species that donates an electron pair to form a new bond.", subject: "Chemistry", difficulty: "hard", topic: "Organic Chemistry" },
    ],
    "Biochemistry": [
      { id: "cbio1", question: "What are the four bases in DNA?", options: ["ATCG", "AUGC", "ATUG", "AGCT"], correctIndex: 0, explanation: "DNA bases are Adenine (A), Thymine (T), Cytosine (C), and Guanine (G).", subject: "Chemistry", difficulty: "easy", topic: "Biochemistry" },
      { id: "cbio2", question: "What is ATP?", options: ["A type of protein", "Adenosine Triphosphate — energy currency", "A nucleic acid", "A lipid"], correctIndex: 1, explanation: "ATP (Adenosine Triphosphate) is the primary energy carrier in cells.", subject: "Chemistry", difficulty: "easy", topic: "Biochemistry" },
      { id: "cbio3", question: "What type of reaction breaks down polymers?", options: ["Polymerization", "Hydrolysis", "Condensation", "Dehydration"], correctIndex: 1, explanation: "Hydrolysis adds water to break bonds in polymers, releasing monomers.", subject: "Chemistry", difficulty: "medium", topic: "Biochemistry" },
      { id: "cbio4", question: "What are the four levels of protein structure?", options: ["Primary, Secondary, Tertiary, Quaternary", "Linear, Circular, Branched, Folded", "Alpha, Beta, Gamma, Delta", "Simple, Complex, Compound, Composite"], correctIndex: 0, explanation: "Protein structure has four levels: Primary (amino acid sequence), Secondary (α-helices, β-sheets), Tertiary (3D folding), Quaternary (multiple subunits).", subject: "Chemistry", difficulty: "medium", topic: "Biochemistry" },
      { id: "cbio5", question: "What is the role of enzymes?", options: ["Structural support", "Biological catalysts that speed up reactions", "Energy storage", "Cell signaling"], correctIndex: 1, explanation: "Enzymes are biological catalysts that lower activation energy and speed up chemical reactions.", subject: "Chemistry", difficulty: "easy", topic: "Biochemistry" },
    ],
  },
  Literature: {
    "Literary Analysis": [
      { id: "lla1", question: "What is a metaphor?", options: ["A comparison using 'like' or 'as'", "A direct comparison without 'like' or 'as'", "An exaggeration", "Giving human qualities to non-human things"], correctIndex: 1, explanation: "A metaphor directly compares two unlike things without using 'like' or 'as'.", subject: "Literature", difficulty: "easy", topic: "Literary Terms" },
      { id: "lla2", question: "What is the protagonist of a story?", options: ["The villain", "The main character", "The narrator", "The setting"], correctIndex: 1, explanation: "The protagonist is the main character of a story, often the hero.", subject: "Literature", difficulty: "easy", topic: "Literary Terms" },
      { id: "lla3", question: "What is foreshadowing?", options: ["Looking backward in time", "Hints about future events in a story", "A flashback", "A character's inner thoughts"], correctIndex: 1, explanation: "Foreshadowing provides clues or hints about events that will happen later in the story.", subject: "Literature", difficulty: "easy", topic: "Literary Terms" },
      { id: "lla4", question: "What is an unreliable narrator?", options: ["A narrator who can't be heard", "A narrator whose account cannot be fully trusted", "A third-person narrator", "A narrator who doesn't speak"], correctIndex: 1, explanation: "An unreliable narrator is a narrator whose credibility is compromised, making their account questionable.", subject: "Literature", difficulty: "medium", topic: "Literary Terms" },
      { id: "lla5", question: "What is the theme of a literary work?", options: ["The setting", "The central idea or message", "The main character", "The plot"], correctIndex: 1, explanation: "Theme is the central idea, message, or insight about life that the author conveys.", subject: "Literature", difficulty: "easy", topic: "Literary Terms" },
    ],
    "Shakespeare Studies": [
      { id: "lss1", question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], correctIndex: 1, explanation: "William Shakespeare wrote 'Romeo and Juliet' around 1594-1596.", subject: "Literature", difficulty: "easy", topic: "Shakespeare" },
      { id: "lss2", question: "In which play does the line 'To be, or not to be' appear?", options: ["Macbeth", "Hamlet", "Othello", "King Lear"], correctIndex: 1, explanation: "This famous soliloquy is from Act 3, Scene 1 of Hamlet.", subject: "Literature", difficulty: "easy", topic: "Shakespeare" },
      { id: "lss3", question: "What is a Shakespearean sonnet?", options: ["12 lines, ABAB rhyme", "14 lines, ABAB CDCD EFEF GG", "10 lines, no rhyme", "20 lines, free verse"], correctIndex: 1, explanation: "A Shakespearean sonnet has 14 lines in iambic pentameter with the rhyme scheme ABAB CDCD EFEF GG.", subject: "Literature", difficulty: "medium", topic: "Shakespeare" },
      { id: "lss4", question: "Who is the villain in 'Othello'?", options: ["Othello", "Desdemona", "Iago", "Cassio"], correctIndex: 2, explanation: "Iago is the villain who manipulates Othello into believing Desdemona is unfaithful.", subject: "Literature", difficulty: "medium", topic: "Shakespeare" },
      { id: "lss5", question: "What genre is 'A Midsummer Night's Dream'?", options: ["Tragedy", "Comedy", "History", "Sonnet"], correctIndex: 1, explanation: "'A Midsummer Night's Dream' is a comedy — one of Shakespeare's most famous comedic plays.", subject: "Literature", difficulty: "easy", topic: "Shakespeare" },
    ],
  },
  History: {
    "World History": [
      { id: "hwh1", question: "When did World War II end?", options: ["1943", "1944", "1945", "1946"], correctIndex: 2, explanation: "World War II ended in 1945 with the surrender of Germany in May and Japan in September.", subject: "History", difficulty: "easy", topic: "World History" },
      { id: "hwh2", question: "Who was the first President of the United States?", options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"], correctIndex: 1, explanation: "George Washington was the first President, serving from 1789 to 1797.", subject: "History", difficulty: "easy", topic: "World History" },
      { id: "hwh3", question: "What was the Renaissance?", options: ["A war", "A cultural rebirth in Europe starting in Italy", "A religious movement", "An economic crisis"], correctIndex: 1, explanation: "The Renaissance was a cultural movement from the 14th to 17th century, beginning in Italy, that led to advances in art, science, and learning.", subject: "History", difficulty: "easy", topic: "World History" },
      { id: "hwh4", question: "When did the French Revolution begin?", options: ["1776", "1789", "1799", "1804"], correctIndex: 1, explanation: "The French Revolution began in 1789 with the storming of the Bastille.", subject: "History", difficulty: "easy", topic: "World History" },
      { id: "hwh5", question: "Who discovered America in 1492?", options: ["Vasco da Gama", "Christopher Columbus", "Ferdinand Magellan", "Amerigo Vespucci"], correctIndex: 1, explanation: "Christopher Columbus reached the Americas in 1492, sailing under the Spanish flag.", subject: "History", difficulty: "easy", topic: "World History" },
    ],
    "Ancient History": [
      { id: "hah1", question: "Which ancient civilization built the pyramids?", options: ["Greek", "Roman", "Egyptian", "Mesopotamian"], correctIndex: 2, explanation: "The ancient Egyptians built the pyramids, most famously the Great Pyramid of Giza.", subject: "History", difficulty: "easy", topic: "Ancient History" },
      { id: "hah2", question: "What was the Roman Empire's written law code called?", options: ["Magna Carta", "Twelve Tables", "Code of Hammurabi", "Bill of Rights"], correctIndex: 1, explanation: "The Twelve Tables were the foundational code of Roman law, created around 450 BCE.", subject: "History", difficulty: "medium", topic: "Ancient History" },
      { id: "hah3", question: "Which Greek philosopher taught Alexander the Great?", options: ["Socrates", "Plato", "Aristotle", "Pythagoras"], correctIndex: 2, explanation: "Aristotle was the tutor of Alexander the Great.", subject: "History", difficulty: "medium", topic: "Ancient History" },
      { id: "hah4", question: "What was the Silk Road?", options: ["A type of fabric", "Ancient trade route between East and West", "A Chinese dynasty", "A Roman road"], correctIndex: 1, explanation: "The Silk Road was an ancient network of trade routes connecting East Asia with the Mediterranean world.", subject: "History", difficulty: "easy", topic: "Ancient History" },
      { id: "hah5", question: "Which empire was ruled by Genghis Khan?", options: ["Ottoman Empire", "Mongol Empire", "Roman Empire", "Persian Empire"], correctIndex: 1, explanation: "Genghis Khan founded and ruled the Mongol Empire in the 13th century.", subject: "History", difficulty: "easy", topic: "Ancient History" },
    ],
  },
  Languages: {
    "Spanish Basics": [
      { id: "lsb1", question: "How do you say 'hello' in Spanish?", options: ["Hola", "Bonjour", "Ciao", "Hallo"], correctIndex: 0, explanation: "'Hola' is the Spanish word for 'hello'.", subject: "Languages", difficulty: "easy", topic: "Spanish Basics" },
      { id: "lsb2", question: "What does 'gracias' mean?", options: ["Please", "Thank you", "Goodbye", "Sorry"], correctIndex: 1, explanation: "'Gracias' means 'thank you' in Spanish.", subject: "Languages", difficulty: "easy", topic: "Spanish Basics" },
      { id: "lsb3", question: "What is 'the house' in Spanish?", options: ["La casa", "El casa", "Le maison", "Das Haus"], correctIndex: 0, explanation: "'Casa' is feminine in Spanish, so it uses the feminine article 'la'.", subject: "Languages", difficulty: "easy", topic: "Spanish Basics" },
      { id: "lsb4", question: "How do you say 'I am hungry' in Spanish?", options: ["Yo tengo hambre", "Yo soy hambre", "Yo es hambre", "Yo tiene hambre"], correctIndex: 0, explanation: "In Spanish, hunger is expressed as 'tener hambre' (to have hunger), not 'ser hambre'.", subject: "Languages", difficulty: "medium", topic: "Spanish Basics" },
      { id: "lsb5", question: "What does '¿Cómo estás?' mean?", options: ["What is your name?", "How are you?", "Where are you?", "When are you coming?"], correctIndex: 1, explanation: "'¿Cómo estás?' means 'How are you?' — an informal greeting.", subject: "Languages", difficulty: "easy", topic: "Spanish Basics" },
    ],
  },
};

// Get all available topics for a subject
export function getTopicsForSubject(subject: string): string[] {
  return Object.keys(questionBanks[subject] || {});
}

// Get all available subjects
export function getAllSubjects(): string[] {
  return Object.keys(questionBanks);
}

// Generate a quiz from the question bank
export function generateQuiz(
  subject: string,
  topic: string,
  difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed",
  questionCount: number = 10
): GeneratedQuiz | null {
  const subjectBank = questionBanks[subject];
  if (!subjectBank) return null;

  let availableQuestions: GeneratedQuestion[] = [];

  if (topic === "all" || topic === "All") {
    // Get questions from all topics in the subject
    availableQuestions = Object.values(subjectBank).flat();
  } else {
    availableQuestions = subjectBank[topic] || [];
  }

  // Filter by difficulty if not mixed
  if (difficulty !== "mixed") {
    const filtered = availableQuestions.filter((q) => q.difficulty === difficulty);
    if (filtered.length >= questionCount) {
      availableQuestions = filtered;
    }
  }

  // Shuffle and pick questions
  const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

  if (selected.length === 0) return null;

  // Re-assign IDs
  const questions = selected.map((q, i) => ({
    ...q,
    id: `ai-${Date.now()}-${i}`,
  }));

  const icons: Record<string, string> = {
    Mathematics: "📐",
    Physics: "⚛️",
    "Computer Science": "💻",
    Biology: "🧬",
    Chemistry: "🧪",
    Literature: "📖",
    History: "🏛️",
    Languages: "🌍",
  };

  return {
    id: `ai-quiz-${Date.now()}`,
    name: topic === "all" || topic === "All" ? `${subject} Mixed Quiz` : topic,
    subject,
    icon: icons[subject] || "📝",
    questions,
    difficulty: difficulty === "mixed" ? "medium" : difficulty,
    estimatedTime: Math.ceil(questions.length * 1.5),
    xpReward: questions.length * 15,
    generatedAt: new Date().toISOString(),
    aiGenerated: true,
  };
}

// Generate quiz from user's notes (analyze content and create relevant questions)
export function generateQuizFromNotes(
  noteContent: string,
  subject: string,
  questionCount: number = 5
): GeneratedQuestion[] {
  // Extract keywords from note content
  const words = noteContent.toLowerCase().split(/\s+/);
  const keywords = words.filter((w) => w.length > 4);

  // Find matching questions from the bank
  const subjectBank = questionBanks[subject] || {};
  const allQuestions = Object.values(subjectBank).flat();

  // Score questions by keyword relevance
  const scored = allQuestions.map((q) => {
    const score = keywords.filter(
      (kw) =>
        q.question.toLowerCase().includes(kw) ||
        q.explanation.toLowerCase().includes(kw) ||
        q.topic.toLowerCase().includes(kw)
    ).length;
    return { ...q, relevanceScore: score };
  });

  // Sort by relevance and take top questions
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // If no relevance matches, return random questions
  if (scored[0]?.relevanceScore === 0) {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  }

  return scored.slice(0, questionCount);
}
