# 📝 GlazeNotes — Production-Grade AI Second Brain

GlazeNotes is a high-performance, portfolio-grade **AI Second Brain** and knowledge management system built to demonstrate advanced AI engineering and premium web design. It features modern block-based document editing, dynamic workspace organization, multi-format exports, and a suite of intelligence features powered by **Google Gemini** and a high-performance **Groq Semantic Search Engine**.

The entire user interface is designed with a gorgeous, custom **Neumorphic & Glassmorphic Design System** that feels premium, tactile, and highly responsive.

---

## 🚀 Key Features & AI Engineering Depth

### 🧠 1. Context-Aware AI Chat Companion
*   **Per-Note Thread Persistence:** Conversations are persisted in MongoDB linked to specific notes, ensuring you never lose your context.
*   **Memory-Enabled Conversational Loop:** Chat threads are sent to the AI engine with full historical context, allowing multi-turn discussions, content brainstorming, and continuous revision.
*   **Interactive Inline Actions:** Ask the AI to write sections, edit block contents, or extract items directly into your notes.

### 🔍 2. Ultra-Fast Semantic Search Engine
*   **Semantic & Keyword Hybrid Search:** Searches are processed through a highly-optimized Groq AI-ranking pipeline (Llama 3.3 70B Versatile), ranking note matching relevance conceptually under **400ms**.
*   **Instant Query Debouncing:** Features real-time responsive results as you type, indicating matched percentages directly on note bento cards.

### ✨ 3. AI-Powered Smart Summarization & Auto-Tagging
*   **One-Click TL;DR Summaries:** Generate structured summaries, key takeaways, and action items with a single click, instantly placed at the top of your document.
*   **Automated Label Categorization:** When saving, the AI analyzes note contents and automatically generates 3-5 relevant hashtags for easy filtering.

### ✏️ 4. Notion-Like Block-Based Editor
*   **Slash-Command Controls:** Instantly format headings, bullet lists, code blocks, or quote highlights by typing `/`.
*   **Tactile Formatting Toolbars:** Floating contextual toolbars adapt to text selections for rapid block modification.

### 📁 5. Dynamic Workspace Folders & Organization
*   **Sidebar Workspaces:** Organize, filter, and categorise notes by custom workspaces with user-selected colors.
*   **Flexible Restructuring:** Smooth folder reassignment, creation, and deletion with safe cascade rules (deleted folders safely return notes to unassigned).

### 📤 6. Advanced Export Engine
*   **Multi-Format Document Generation:** Export block structures directly into beautiful **PDF**, **DOCX**, **Markdown (.md)**, or **Plain Text (.txt)** files with proper typographic hierarchy.

---

## 🛠️ Tech Stack & Architecture

```mermaid
graph TD
    User[Client Browser] <-->|HTTPS / React 19| FE[Vite + React Frontend]
    FE <-->|REST API| BE[Express.js Node API]
    BE <-->|Mongoose ODM| DB[(MongoDB Database)]
    BE <-->|Chat & Summarize APIs| Gemini[Google Gemini 2.5 Flash]
    BE <-->|Semantic Matching Engine| Groq[Groq Llama 3.3 70B]
    FE -->|Document Exports| HTML2PDF[html2pdf.js]
    FE -->|Document Exports| DOCXJS[docx library]
```

### **Frontend**
*   **Core:** React 19 (Hooks, Context Provider), Vite 7 (High-performance bundler)
*   **Rich Editor:** BlockNote (ProseMirror / TipTap wrappers)
*   **Styling:** Custom Neumorphism/Glassmorphism theme built with modern CSS variables, fluid transitions, and tactile button states
*   **Icons:** Lucide-React
*   **Utilities:** `docx` API, `html2pdf.js`, `axios`

### **Backend**
*   **Core:** Node.js, Express 5 (Asynchronous middleware pipeline)
*   **Database:** MongoDB Atlas + Mongoose 9 ODM
*   **AI Integration:** `@google/genai` SDK, `groq-sdk`
*   **Security:** JWT Authentication, BCrypt hash salts, `express-rate-limit` rate-limiting middleware, CORS guards

---

## 🚦 Getting Started

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or Atlas)
*   Google Gemini API Key
*   Groq API Key (Optional, falls back to regular full-text search)

### 2. Installation & Setup

Clone the repository and install dependencies in both folders:

```bash
# Clone the repository
git clone https://github.com/yourusername/GlazeNotes.git
cd GlazeNotes

# Install Backend dependencies
cd Backend
npm install

# Install Frontend dependencies
cd ../Frontend
npm install
```

### 3. Environment Variables

Create a `.env` file in the **Backend** folder:
```env
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/glazenotes
JWT_SECRET=your_ultra_secure_jwt_secret_key_string
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

Create a `.env` file in the **Frontend** folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

### 4. Running the Application

Start the Backend Server:
```bash
cd Backend
npm run dev
```

Start the Frontend Server:
```bash
cd Frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔒 Security & Best Practices Verified
*   **No Exposed Credentials:** Active secrets have been rotated and purged from git history.
*   **Robust Middleware Guards:** JWT route verification secures all note content, folder modifications, and chats against cross-user exposure.
*   **Double-Response Safe Routing:** Custom error-catching middleware wraps all Express routes to prevent crash states.
*   **Spam Rate Limiting:** Dynamic endpoint limiters block automated API queries.

---

*Designed and engineered with absolute visual and architectural quality.* ✨
