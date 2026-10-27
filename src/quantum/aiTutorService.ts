import { GoogleGenAI } from '@google/genai';
import { CircuitModel, GateType } from './types';
import { GATES_DATA } from '../data/gatesData';
import { LESSONS_DATA } from '../data/lessonsData';
import { LABS_DATA } from '../data/labsData';
import { GLOSSARY_DATA } from '../data/glossaryData';
import { FULL_ASSESSMENT_QUESTIONS } from '../data/assessmentQuestions';
import { AssessmentRecord, TutorMessage } from '../types/labTypes';
import { QuantumSimulator } from './simulator';

export interface TutorContext {
  studentName: string | null;
  currentCircuit: CircuitModel;
  completedLessons: string[];
  completedLabs: string[];
  assessmentHistory: AssessmentRecord[];
}

export interface TutorResponse {
  content: string;
  suggestedActions: string[];
  relatedLessonId?: string;
  relatedGateId?: GateType;
  relatedLabId?: string;
}

// Check if Gemini API key exists
const getGeminiClient = () => {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY);
  if (apiKey && typeof apiKey === 'string' && apiKey.length > 5) {
    try {
      return new GoogleGenAI({ apiKey });
    } catch (e) {
      console.warn('Could not initialize GoogleGenAI client:', e);
    }
  }
  return null;
};

/**
 * Analyze a circuit and provide a comprehensive physical and mathematical breakdown
 */
export function analyzeCircuitForTutor(circuit: CircuitModel): string {
  const totalGates = circuit.gates.length;
  const qCount = circuit.qubitsCount;
  if (totalGates === 0) {
    return `Your canvas currently has **${qCount} empty qubit wire${qCount > 1 ? 's' : ''}** initialized to state $|0\\rangle^{\\otimes ${qCount}}$.

**State vector:**
$$|\\psi_0\\rangle = |${'0'.repeat(qCount)}\\rangle$$

**To get started:**
1. Drag a **Hadamard (H)** gate to create a superposition: $|+\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)$.
2. Or drag a **Pauli-X (NOT)** gate to flip a qubit from $|0\\rangle$ to $|1\\rangle$.
3. Run simulation anytime to inspect state vectors, probabilities, and the 3D Bloch sphere!`;
  }

  // Count gate occurrences
  const gateCounts: Record<string, number> = {};
  circuit.gates.forEach(g => {
    gateCounts[g.type] = (gateCounts[g.type] || 0) + 1;
  });

  const gateBreakdown = Object.entries(gateCounts)
    .map(([type, count]) => `• **${type}** (${GATES_DATA[type as GateType]?.name || type}): ${count} gate${count > 1 ? 's' : ''}`)
    .join('\n');

  // Check for entanglement (e.g. H followed by CX/CNOT)
  const hasHadamard = circuit.gates.some(g => g.type === 'H');
  const hasEntanglingGate = circuit.gates.some(g => ['CX', 'CZ', 'CP', 'SWAP', 'CCX'].includes(g.type));
  const isLikelyEntangled = hasHadamard && hasEntanglingGate;

  // Simulate to get state probabilities
  let simSummary = '';
  try {
    const simResult = QuantumSimulator.simulate(circuit, 1024);
    const topStates: string[] = [];
    simResult.basisStates.forEach((state, i) => {
      const prob = simResult.probabilities[i];
      if (prob > 0.001) {
        topStates.push(`|${state}⟩: ${(prob * 100).toFixed(1)}%`);
      }
    });
    const formatted = topStates.slice(0, 4).join(', ');
    simSummary = formatted ? `\n\n**Theoretical Measurement Outcomes:**\n${formatted}` : '';
  } catch (err) {
    simSummary = '';
  }

  let entanglementNote = '';
  if (isLikelyEntangled) {
    entanglementNote = `\n\n✨ **Quantum Entanglement Detected:** Your circuit combines superposition with multi-qubit entangling gates (${circuit.gates.filter(g => ['CX', 'CZ', 'CCX'].includes(g.type)).map(g => g.type).join(', ')}). The composite state cannot be factored into independent individual qubits!`;
  }

  return `### Circuit Analysis: "${circuit.name || 'Untitled Circuit'}"

**Architecture:**
• **Qubits:** ${qCount} wires
• **Total Operations:** ${totalGates} gates
• **Gates Applied:**
${gateBreakdown}${entanglementNote}${simSummary}

**Step-by-Step Flow:**
1. All qubits initialize in the ground state $|0\\rangle^{\\otimes ${qCount}}$.
2. Sequential unitary operators are applied from column 0 across all time slices.
3. Superposition & relative phases are interference-modulated across basis amplitudes.`;
}

/**
 * Diagnostic analysis for why an assessment question was missed
 */
export function explainAssessmentMistake(context: TutorContext): { content: string; relatedLessonId?: string } {
  if (context.assessmentHistory.length === 0) {
    return {
      content: `You haven't completed an assessment test yet! 

Head over to **Tests & Assessments** in the navigation to take **Assessment Test 1: Full Comprehensive Examination (25 Questions)**. 

Once you submit a test, I will analyze your answer sheet, identify every question you answered incorrectly, and provide detailed step-by-step mathematical proofs explaining why each option is correct or incorrect.`,
      relatedLessonId: 'lesson-1',
    };
  }

  const latestTest = context.assessmentHistory[context.assessmentHistory.length - 1];
  const userAnswers = latestTest.answers || {};

  // Find missed questions from FULL_ASSESSMENT_QUESTIONS
  const missedList: Array<{ q: (typeof FULL_ASSESSMENT_QUESTIONS)[0]; userIdx: number }> = [];
  for (const q of FULL_ASSESSMENT_QUESTIONS) {
    if (userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.correctIndex) {
      missedList.push({ q, userIdx: userAnswers[q.id] });
    }
  }

  if (missedList.length === 0) {
    return {
      content: `🎉 Outstanding work, **${context.studentName || 'Quantum Scholar'}**! 

In your latest assessment (**${latestTest.title}**), you scored **${latestTest.score} / ${latestTest.total} (${latestTest.percentage.toFixed(0)}%)**! 

You didn't miss any questions in this record. You have demonstrated exceptional mastery over quantum state vectors, unitary operators, and measurement theorems. 

Would you like to try the **Circuit Debugger** or test advanced algorithms in **Quantum Labs** next?`,
    };
  }

  const firstMissed = missedList[0];
  const q = firstMissed.q;
  const pickedAnswer = q.options[firstMissed.userIdx] || 'No answer';
  const correctAnswer = q.options[q.correctIndex];

  return {
    content: `### Assessment Review: ${latestTest.title}
In your latest exam, you scored **${latestTest.score}/${latestTest.total} (${latestTest.percentage.toFixed(0)}%)**. Here is a breakdown of one of the questions you missed:

**Question (${q.stageName} · ${q.topic}):**
> *"${q.question}"*

❌ **Your Choice:** \`${pickedAnswer}\`
✅ **Correct Answer:** \`${correctAnswer}\`

**Why this is the correct answer:**
${q.explanation}

**Concept Review:**
Remember that in quantum mechanics, unitary gates preserve the inner product and norm $\\sum |\\alpha_i|^2 = 1$. Reviewing Lesson 1 & 2 will reinforce these foundational rules.`,
    relatedLessonId: 'lesson-1',
  };
}

/**
 * Recommends the next optimal lesson and lab based on student progress
 */
export function getNextLearningRecommendation(context: TutorContext): { content: string; relatedLessonId?: string; relatedLabId?: string } {
  const completedLessonSet = new Set(context.completedLessons);
  const nextLesson = LESSONS_DATA.find(l => !completedLessonSet.has(l.id));

  const completedLabSet = new Set(context.completedLabs);
  const nextLab = LABS_DATA.find(lab => !completedLabSet.has(lab.id));

  if (!nextLesson && !nextLab) {
    return {
      content: `🏆 **Mastery Achieved!** 
You have completed all 26 Quantum Academy lessons and all 12 hands-on laboratories! 

**Recommended next steps:**
1. Head to **Circuit Studio** to build custom multi-qubit algorithms like Grover's Search or Quantum Teleportation.
2. Visit **Practice Arena** to test your rapid recall against 100+ randomized quantum questions.
3. Strive for 100% on the **Stage 5 Challenging Assessment** to earn the Grandmaster Quantum Achievement!`,
    };
  }

  const lessonSnippet = nextLesson
    ? `**Recommended Lesson:**
• **${nextLesson.title}** (${nextLesson.level.toUpperCase()} · ~${nextLesson.estimatedMinutes} mins)
• *Key Objectives:* ${nextLesson.objectives.slice(0, 2).join('; ')}
• *Summary:* ${nextLesson.summary}`
    : `You have completed all 26 core Academy lessons!`;

  const labSnippet = nextLab
    ? `\n\n**Recommended Hands-on Laboratory:**
• **${nextLab.title}** (~${nextLab.estimatedMinutes} mins)
• *Objectives:* ${nextLab.objectives[0]}`
    : '';

  return {
    content: `### Personalized Learning Path for ${context.studentName || 'Student'}

You have mastered **${context.completedLessons.length}/26 lessons** and completed **${context.completedLabs.length}/12 labs**.

${lessonSnippet}${labSnippet}

Would you like me to explain the core concepts of this lesson, or provide an interactive circuit example?`,
    relatedLessonId: nextLesson?.id,
    relatedLabId: nextLab?.id,
  };
}

/**
 * Core Knowledge Engine: Generates intelligent responses with deterministic quantum precision
 */
export async function getTutorAnswer(
  userQuery: string,
  context: TutorContext,
  lastAssistantMessage?: TutorMessage,
  actionRequested?: string
): Promise<TutorResponse> {
  const qLower = userQuery.toLowerCase().trim();

  // Handle contextual action pills ("Explain more simply", "Give an example", "Suggest a related lesson", "Clear explanation")
  if (actionRequested && lastAssistantMessage) {
    return handleContextAction(actionRequested, lastAssistantMessage, context);
  }

  // 1. Context-aware specific requests: "How does my circuit work?"
  if (
    qLower.includes('how does my circuit work') ||
    qLower.includes('how my circuit works') ||
    qLower.includes('explain my circuit') ||
    qLower.includes('diagnose my circuit') ||
    qLower.includes('analyze my circuit') ||
    qLower.includes('what does my circuit do')
  ) {
    const analysis = analyzeCircuitForTutor(context.currentCircuit);
    return {
      content: analysis,
      suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
      relatedLessonId: 'lesson-6',
    };
  }

  // 2. Context-aware: "Why did I get this assessment question wrong?"
  if (
    qLower.includes('assessment question wrong') ||
    qLower.includes('why did i get this wrong') ||
    qLower.includes('why was my answer incorrect') ||
    qLower.includes('review my test') ||
    qLower.includes('assessment mistake')
  ) {
    const review = explainAssessmentMistake(context);
    return {
      content: review.content,
      suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
      relatedLessonId: review.relatedLessonId,
    };
  }

  // 3. Context-aware: "What should I learn next?"
  if (
    qLower.includes('what should i learn next') ||
    qLower.includes('what next') ||
    qLower.includes('next lesson') ||
    qLower.includes('learning path') ||
    qLower.includes('where to start') ||
    qLower.includes('suggest next')
  ) {
    const rec = getNextLearningRecommendation(context);
    return {
      content: rec.content,
      suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
      relatedLessonId: rec.relatedLessonId,
      relatedLabId: rec.relatedLabId,
    };
  }

  // 4. "What is a qubit?"
  if (
    qLower.includes('what is a qubit') ||
    qLower === 'qubit' ||
    qLower.includes('define qubit') ||
    qLower.includes('explain qubit')
  ) {
    return {
      content: `### What is a Qubit?

A **qubit** (quantum bit) is the foundational unit of quantum information, contrasting sharply with a classical computer's binary bit.

#### 1. Classical Bit vs. Qubit
• **Classical Bit:** Can only exist deterministically as **0** (off / 0V) or **1** (on / 5V).
• **Qubit:** Can exist in state $|0\\rangle$, state $|1\\rangle$, or any continuous linear combination (**superposition**) of both simultaneously:

$$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle$$

Where $\\alpha$ and $\\beta$ are complex numbers known as **probability amplitudes**.

#### 2. The Normalization Condition (Born Rule)
When measured in the computational basis $\{|0\\rangle, |1\\rangle\}$, the qubit collapses irreversibly:
• Probability of measuring $|0\\rangle$: $P(0) = |\\alpha|^2$
• Probability of measuring $|1\\rangle$: $P(1) = |\\beta|^2$
• Total probability must sum to unity: **$|\\alpha|^2 + |\\beta|^2 = 1$**

#### 3. Geometric Picture: The Bloch Sphere
Any single pure qubit state can be mapped to a point on the surface of a unit sphere (the **Bloch Sphere**) with coordinates:
$$|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right)|0\\rangle + e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)|1\\rangle$$
• **North Pole ($\theta = 0$):** Pure state $|0\\rangle$
• **South Pole ($\theta = \pi$):** Pure state $|1\\rangle$
• **Equator ($\theta = \pi/2$):** Equal superpositions like $|+\\rangle$ and $|-\\rangle$.`,
      suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
      relatedLessonId: 'lesson-1',
      relatedGateId: 'H',
    };
  }

  // 5. "Explain the Hadamard gate with an example"
  if (
    qLower.includes('hadamard') ||
    qLower.includes('h gate') ||
    qLower.includes('explain h')
  ) {
    return {
      content: `### The Hadamard Gate ($H$)

The **Hadamard gate** is arguably the most famous single-qubit gate in quantum computing. It creates an equal, coherent superposition from basis states.

#### 1. Matrix Representation
$$H = \\frac{1}{\\sqrt{2}} \\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}$$

#### 2. State Transformation
• Applied to ground state $|0\\rangle$:
$$H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}} = |+\\rangle$$
*(Bloch sphere: points directly along the +X axis)*

• Applied to excited state $|1\\rangle$:
$$H|1\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}} = |-\\rangle$$
*(Bloch sphere: points directly along the -X axis)*

#### 3. Concrete Example
If you initialize a qubit in $|0\\rangle$ and apply $H$:
• Probability of observing 0: $|\\frac{1}{\\sqrt{2}}|^2 = \\frac{1}{2} = 50\\%$
• Probability of observing 1: $|\\frac{1}{\\sqrt{2}}|^2 = \\frac{1}{2} = 50\\%$

#### 4. Key Properties
• **Self-inverse (Hermitian & Unitary):** $H \\cdot H = I$. Applying $H$ twice returns the qubit to its initial state:
$$H(H|0\\rangle) = H|+\\rangle = |0\\rangle$$
• **Basis Change:** It rotates between the Z-basis $\{|0\\rangle, |1\\rangle\}$ and the X-basis $\{|+\\rangle, |-\\rangle\}$.

\`\`\`python
# Qiskit syntax
from qiskit import QuantumCircuit
qc = QuantumCircuit(1)
qc.h(0)  # Applies Hadamard to wire 0
\`\`\``,
      suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
      relatedLessonId: 'lesson-4',
      relatedGateId: 'H',
    };
  }

  // 6. "What is the difference between X and Z gates?"
  if (
    (qLower.includes('difference') || qLower.includes('compare') || qLower.includes('versus') || qLower.includes('vs')) &&
    (qLower.includes('x') && qLower.includes('z'))
  ) {
    return {
      content: `### Comparison: Pauli-X vs. Pauli-Z Gate

Both $X$ and $Z$ are fundamental Pauli matrices, but they act on completely different physical degrees of freedom of a qubit:

| Property | **Pauli-X (Bit-Flip / NOT)** | **Pauli-Z (Phase-Flip)** |
|---|---|---|
| **Matrix** | $\\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}$ | $\\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix}$ |
| **Action on $|0\\rangle$** | Maps $|0\\rangle \\to |1\\rangle$ | Leaves $|0\\rangle \\to |0\\rangle$ unchanged |
| **Action on $|1\\rangle$** | Maps $|1\\rangle \\to |0\\rangle$ | Flips sign: $|1\\rangle \\to -|1\\rangle$ |
| **Bloch Sphere Rotation** | $180^\\circ$ ($\pi$ rad) rotation around the **X-axis** | $180^\\circ$ ($\pi$ rad) rotation around the **Z-axis** |
| **Action on $|+\\rangle$** | $X|+\\rangle = |+\\rangle$ (Eigenstate! No change!) | $Z|+\\rangle = |-\\rangle$ (Swaps relative phase!) |
| **Qiskit Code** | \`qc.x(0)\` | \`qc.z(0)\` |

#### Key Insight
• **$X$ changes probability:** It turns a 100% chance of 0 into a 100% chance of 1.
• **$Z$ changes phase:** It does not change measurement probabilities of $|0\\rangle$ and $|1\\rangle$ ($|-1|^2 = 1$). However, its phase flip dramatically alters how the qubit interferes when subsequent gates (like $H$) are applied!`,
      suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
      relatedLessonId: 'lesson-3',
      relatedGateId: 'X',
    };
  }

  // 7. "Why does entanglement matter?"
  if (
    qLower.includes('entanglement matter') ||
    qLower.includes('why entanglement') ||
    qLower.includes('what is entanglement') ||
    qLower.includes('explain entanglement')
  ) {
    return {
      content: `### Why Does Quantum Entanglement Matter?

Quantum entanglement is described by Albert Einstein as *"spooky action at a distance"*. It is the physical resource that powers the true computational speedup of quantum computers.

#### 1. Mathematical Definition
Two or more qubits are **entangled** when their joint state cannot be decomposed into a tensor product of independent states:
$$|\\psi_{AB}\\rangle \\neq |\\psi_A\\rangle \\otimes |\\psi_B\\rangle$$

For example, the canonical Bell State $|\Phi^+\rangle$:
$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$
Neither qubit has a definite state on its own! If you measure qubit A and find $0$, qubit B collapses to $0$ immediately, regardless of spatial separation.

#### 2. Why It Matters for Computing
1. **Exponential State Space:** $N$ classical bits represent only 1 of $2^N$ numbers at a time. $N$ entangled qubits manipulate all $2^N$ amplitudes in parallel. At 300 entangled qubits, $2^{300}$ exceeds the number of atoms in the observable universe!
2. **Quantum Algorithms:**
   • **Shor's Algorithm:** Uses entanglement and quantum phase estimation to factor large integers in polynomial time.
   • **Grover's Search:** Uses entangled states and amplitude amplification for quadratic speedup.
3. **Quantum Communications & Security:**
   • **Quantum Key Distribution (QKD - E91 / BB84):** Provides eavesdropper-detecting cryptosystems proven unbreakable by physics laws.
   • **Quantum Teleportation:** Transmits unknown quantum states across arbitrary distances using shared Bell pairs.

#### 3. How to Create Entanglement in QuantumGate Lab
1. Wire 0: Add a **Hadamard (H)** gate.
2. Wire 0 & 1: Add a **CNOT (CX)** gate with wire 0 as control and wire 1 as target.`,
      suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
      relatedLessonId: 'lesson-8',
      relatedLabId: 'lab-3',
      relatedGateId: 'CX',
    };
  }

  // 8. Gate-specific lookup from GATES_DATA
  for (const [key, gate] of Object.entries(GATES_DATA)) {
    const symbolMatches = qLower === gate.symbol.toLowerCase() || qLower === `gate ${gate.symbol.toLowerCase()}` || qLower === `${gate.symbol.toLowerCase()} gate`;
    const nameMatches = qLower.includes(gate.name.toLowerCase());
    if (symbolMatches || nameMatches) {
      return {
        content: `### ${gate.name} (\`${gate.symbol}\`)

**Category:** ${gate.category.toUpperCase()} QUBIT · **Level:** ${gate.level.toUpperCase()}

**Definition:**
${gate.definition}

**Purpose & Functionality:**
${gate.purpose}

**Matrix Formulation:**
$$${gate.matrixTex}$$

**Basis Transformation:**
${gate.transformation}

**Input/Output Examples:**
${gate.inputOutputExamples.map(ex => `• Input: \`${ex.input}\` → Output: \`${ex.output}\` (${ex.explanation})`).join('\n')}

**Qiskit Implementation:**
\`\`\`python
${gate.qiskitCode}
\`\`\`

**Key Applications:**
${gate.applications.map(app => `• ${app}`).join('\n')}

**Common Misconceptions:**
${gate.misconceptions.map(m => `⚠️ ${m}`).join('\n')}`,
        suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
        relatedGateId: key as GateType,
      };
    }
  }

  // 9. Lesson lookup from LESSONS_DATA
  const matchedLesson = LESSONS_DATA.find(
    l => qLower.includes(l.title.toLowerCase()) || (l.id.toLowerCase() === qLower)
  );
  if (matchedLesson) {
    return {
      content: `### Lesson Guide: ${matchedLesson.title}

**Difficulty Level:** ${matchedLesson.level.toUpperCase()} · **Estimated Time:** ${matchedLesson.estimatedMinutes} mins

**Summary:**
${matchedLesson.summary}

**Key Objectives:**
${matchedLesson.objectives.map(obj => `• ${obj}`).join('\n')}

**Core Content Overview:**
${matchedLesson.content.slice(0, 450)}...

**Companion Interactive Experiment:**
• *Exercise:* ${matchedLesson.interactiveExperiment.title}
• *Expected State:* \`${matchedLesson.interactiveExperiment.expectedState}\`
• *Instructions:* ${matchedLesson.interactiveExperiment.instructions}`,
      suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
      relatedLessonId: matchedLesson.id,
      relatedLabId: matchedLesson.relatedLabId,
    };
  }

  // 10. Glossary lookup from GLOSSARY_DATA
  const matchedTerm = GLOSSARY_DATA.find(
    t => qLower.includes(t.term.toLowerCase()) || qLower === t.term.toLowerCase()
  );
  if (matchedTerm) {
    return {
      content: `### Quantum Glossary: ${matchedTerm.term}

**Domain:** ${matchedTerm.category.toUpperCase()}

**Short Definition:**
${matchedTerm.shortDef}

**Detailed Physical Explanation:**
${matchedTerm.detailedDef}${matchedTerm.relatedGates ? `\n\n**Related Quantum Gates:** ${matchedTerm.relatedGates.join(', ')}` : ''}`,
      suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
    };
  }

  // 11. Try Gemini Live API if client configured, otherwise fallback to smart comprehensive quantum responder
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const systemInstruction = `You are Quantum AI Tutor, the resident quantum physicist and expert educator inside the QuantumGate Cloud Lab application.
You explain quantum mechanics, quantum gates, qubits, superposition, entanglement, algorithms, and circuits clearly.
Always provide mathematically sound, accessible, and structured explanations with Dirac bra-ket notation and Qiskit code examples when relevant.
The student's name is ${context.studentName || 'Student'}.
Current active circuit: ${context.currentCircuit.qubitsCount} qubits, ${context.currentCircuit.gates.length} gates placed.
Completed lessons: ${context.completedLessons.length}/26.
Keep your answer clear, encouraging, friendly, and structured.`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: userQuery }] }
        ],
        config: {
          systemInstruction,
        }
      });

      if (response && response.text) {
        return {
          content: response.text,
          suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
        };
      }
    } catch (apiError) {
      console.warn('Gemini API call failed, falling back to local quantum knowledge engine:', apiError);
    }
  }

  // 12. Smart General Fallback with Quantum Context
  return {
    content: `### Quantum AI Tutor Insights

Thank you for your question: **"${userQuery}"**!

In quantum information science, quantum mechanics departs from classical intuition through three pillars:
1. **Coherent Superposition:** Qubits access infinite continuous points in Hilbert space $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$ governed by the normalization condition $|\alpha|^2 + |\beta|^2 = 1$.
2. **Phase Interference:** Quantum gates apply unitary operations $U^\dagger U = I$ that rotate the state on the Bloch sphere, producing constructive and destructive interference of probability amplitudes.
3. **Entanglement & Correlation:** Multi-qubit composite states like Bell pairs $\frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$ exhibit correlations that cannot be replicated classically.

**Recommended Exploration inside QuantumGate Lab:**
• Explore **Quantum Academy** (26 curated lessons with knowledge checks).
• Visit **Gate Explorer** to inspect matrices, transformations, and 3D Bloch spheres for 20+ gates.
• Test your circuits in **Quantum Simulator** or debug errors in the **Circuit Debugger**!`,
    suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
    relatedLessonId: 'lesson-1',
  };
}

/**
 * Handle contextual follow-up action pills:
 * - Clear explanation
 * - Give an example
 * - Explain more simply
 * - Suggest a related lesson
 */
function handleContextAction(
  action: string,
  lastMsg: TutorMessage,
  context: TutorContext
): TutorResponse {
  const previousContent = lastMsg.content;

  if (action === 'Explain more simply') {
    return {
      content: `### Simplified Explanation (Intuitive & Beginner-Friendly)

Let's break this down without complicated math:

Imagine a regular classical light switch: it is either flipped **OFF (0)** or **ON (1)**.
Now imagine a spinning coin on a tabletop:
• While it is spinning, is it heads or tails? **It is both at once!** That is **superposition**.
• When you slap your hand down on the coin to stop it, it is forced to choose heads or tails. That is **quantum measurement**.
• If you had two "magic coins" that were entangled, whenever you stop one and see heads, the second coin instantly reveals tails—even if it is on the other side of the planet! That is **entanglement**.

Quantum computers use these physical behaviors to test billions of pathways simultaneously instead of checking them one by one like a regular computer.`,
      suggestedActions: ['Clear explanation', 'Give an example', 'Suggest a related lesson'],
      relatedLessonId: 'lesson-1',
    };
  }

  if (action === 'Give an example') {
    return {
      content: `### Concrete Hands-on Example

Here is a practical, step-by-step example using the **Bell State $|\Phi^+\\rangle$**:

#### Step 1: Initialize Two Qubits in Ground State
$$|\\psi_0\\rangle = |00\\rangle = \\begin{bmatrix} 1 \\\\ 0 \\\\ 0 \\\\ 0 \\end{bmatrix}$$

#### Step 2: Apply Hadamard ($H$) on Qubit 0
This places Qubit 0 into equal superposition:
$$|\\psi_1\\rangle = (H \\otimes I)|00\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\otimes |0\\rangle = \\frac{|00\\rangle + |10\\rangle}{\\sqrt{2}}$$

#### Step 3: Apply CNOT ($CX$) with Control=0, Target=1
Whenever Qubit 0 is $1$, it flips Qubit 1:
$$|\\psi_2\\rangle = \\text{CNOT}|\\psi_1\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}} = |\\Phi^+\\rangle$$

#### Code Snippet (Qiskit):
\`\`\`python
from qiskit import QuantumCircuit
qc = QuantumCircuit(2, 2)
qc.h(0)         # Superposition on wire 0
qc.cx(0, 1)     # Entangle wire 0 and wire 1
qc.measure([0, 1], [0, 1])
\`\`\`
**Result:** 50% probability of $|00\\rangle$, 50% probability of $|11\\rangle$. Outcomes $|01\\rangle$ and $|10\\rangle$ will NEVER occur!`,
      suggestedActions: ['Clear explanation', 'Explain more simply', 'Suggest a related lesson'],
      relatedLessonId: 'lesson-8',
      relatedLabId: 'lab-3',
      relatedGateId: 'CX',
    };
  }

  if (action === 'Clear explanation') {
    return {
      content: `### Key Takeaways & Core Principles

Here is the essential summary organized into core pillars:

1. **The Quantum State:** 
   Physical reality at the microscopic scale is described by state vectors in complex Hilbert space, not binary states.
2. **Reversibility (Unitary Invariance):**
   Every quantum gate (except measurement) preserves quantum information without loss. Mathematically, $U^\\dagger U = I$.
3. **The Measurement Collapse:**
   Observation is fundamentally destructive to superposition. By the Born rule ($P = |\\alpha|^2$), reading a qubit forces it into a classical state.
4. **Computational Power:**
   Quantum speedup does not come from doing classical steps faster; it comes from **quantum interference**, cancelling out incorrect answers while constructively amplifying the correct solution.`,
      suggestedActions: ['Give an example', 'Explain more simply', 'Suggest a related lesson'],
      relatedLessonId: lastMsg.relatedLessonId || 'lesson-1',
    };
  }

  if (action === 'Suggest a related lesson') {
    const lessonId = lastMsg.relatedLessonId || 'lesson-1';
    const lesson = LESSONS_DATA.find(l => l.id === lessonId) || LESSONS_DATA[0];

    return {
      content: `### Recommended Next Lesson: "${lesson.title}"

• **Module:** ${lesson.level.toUpperCase()} Curriculum
• **Estimated Time:** ${lesson.estimatedMinutes} minutes
• **Why this lesson:** It directly expands upon the concepts we just discussed.

**Topics covered:**
${lesson.objectives.map(o => `• ${o}`).join('\n')}

**Summary:**
${lesson.summary}

Click the button below to navigate directly to this lesson in Quantum Academy!`,
      suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply'],
      relatedLessonId: lesson.id,
      relatedLabId: lesson.relatedLabId,
    };
  }

  return {
    content: previousContent,
    suggestedActions: ['Clear explanation', 'Give an example', 'Explain more simply', 'Suggest a related lesson'],
  };
}
