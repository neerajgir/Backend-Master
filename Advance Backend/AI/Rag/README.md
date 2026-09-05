# RAG (Retrieval-Augmented Generation) — Learning Repository

Ye repo **RAG**, **Vector DB**, **Embeddings**, aur **Vectors** ka deep understanding lene ke liye hai. Code snippets, diagrams, aur real-life use cases ke saath.

---

## 🔍 Introduction

**RAG** = Retrieval + Augmented + Generation.  
Jab LLM (GPT, Claude) ko kisi specific knowledge ke saath answer dena ho — jo uske training data mein nahi hai — toh hum external data (documents, PDFs, databases) se relevant chunks **retrieve** karte hain, unhe prompt mein **augment** karte hain, aur LLM se **generate** karwate hain.

**Benefit:**  
- Hallucination kam hoti hai  
- Latest/factual data use kar sakte ho  
- Domain-specific answers milte hain

---

## 🧠 Core Concepts

### 1. Vectors (Embeddings)
Text ko numerical form mein convert karna — **vectors** (high-dimensional arrays).  
Similar text ke vectors aapas mein close hote hain (cosine similarity).  

**Example (Node.js with `@xenova/transformers`):**
```js
import { pipeline } from '@xenova/transformers';

const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
const vector = await extractor('RAG ka matlab hai Retrieval-Augmented Generation', { pooling: 'mean' });
console.log(vector); // Float32Array(384)
```

### 2. Vector Embedding
Embedding model (e.g., `all-MiniLM-L6-v2`) har chunk ko ek vector mein map karta hai.  
Ye vector us text ka **semantic representation** hota hai.

### 3. Vector Database
Vector DB (Pinecone, Milvus, Weaviate, Chroma) efficiently store karta hai thousands/millions of vectors aur similarity search (ANN) karta hai.

**Indexing:**  
- Chunks → Embeddings → Store in Vector DB

**Querying:**  
- User query → Embedding → Search → Top-k similar chunks

**Example (Chroma with Node.js):**
```js
import { ChromaClient } from 'chromadb';

const client = new ChromaClient();
const collection = await client.getOrCreateCollection({ name: 'docs' });

// Add
await collection.add({
  ids: ['id1'],
  embeddings: [vector],
  metadatas: [{ source: 'knowledge.pdf' }],
  documents: ['RAG ka full form...']
});

// Query
const results = await collection.query({
  queryEmbeddings: [queryVector],
  nResults: 3
});
```

---

## 📊 Diagram Explanation (Flow)

```
+----------------+     +------------------+     +---------------+
|  User Query    | --> |  Embed (model)   | --> |  Vector DB    |
| "What is RAG?" |     |  → query vector  |     |  (search top-k)|
+----------------+     +------------------+     +---------------+
                                                          |
                                                          v
+----------------+     +------------------+     +-------------------+
|  LLM (GPT)     | <-- |  Prompt + chunks | <-- |  Retrieved chunks |
|  Generate      |     |  (augmented)     |     |  (context)        |
+----------------+     +------------------+     +-------------------+
```

**Steps:**  
1. Query ko embed karo  
2. Vector DB mein similar chunks dhundho  
3. Chunks + original query → prompt  
4. LLM se final answer generate karo  

---

## 💻 Code Snippet – Complete RAG Pipeline (Node.js)
```js
import { pipeline } from '@xenova/transformers';
import { ChromaClient } from 'chromadb';
import { OpenAI } from 'openai';

const embed = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
const client = new ChromaClient();
const collection = await client.getOrCreateCollection({ name: 'docs' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function ask(question) {
  // 1. Embed question
  const qVec = await embed(question, { pooling: 'mean' });
  // 2. Search
  const results = await collection.query({ queryEmbeddings: [qVec], nResults: 3 });
  const context = results.documents[0].join('\n');
  // 3. Augment
  const prompt = `Context: ${context}\nQuestion: ${question}\nAnswer:`;
  // 4. Generate
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  });
  return completion.choices[0].message.content;
}
```

---

## 🌍 Real-Life Usages

| Domain | Use Case |
|--------|----------|
| **Customer Support** | Company docs se answers generate karna |
| **Healthcare** | Medical records + research papers se diagnosis assist |
| **Legal** | Case laws aur contracts ka summarization |
| **E-commerce** | Product search aur recommendations |
| **Education** | PDF textbooks se personalized tutoring |

---

## 🧰 Tools Used in This Repo

- **Chroma** (vector DB)  
- **Transformers.js** (embeddings)  
- **OpenAI API** (LLM)  
- (or use local LLM with Ollama)

---

## 📁 Folder Structure

```
Rag/
├── index.js          # main pipeline
├── knowledge.pdf     # sample data
├── package.json
└── .env
```

---

## 🚀 Getting Started

```bash
npm install
# Set OPENAI_API_KEY in .env
node index.js
```

---

## 🔗 Further Reading

- [LangChain RAG](https://python.langchain.com/docs/use_cases/question_answering/)
- [Pinecone Docs](https://www.pinecone.io/learn/)
- [HuggingFace Embeddings](https://huggingface.co/sentence-transformers)

**Happy Learning! 🧠**  
*Koi bhi doubt ho toh issue kholo ya DM karo.*