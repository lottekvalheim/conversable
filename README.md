# 🧠 Conversable

## 📝 Description

Conversable is a **document-based conversational AI** tool enabling users to **upload PDFs and interact** with the content through natural language queries. Built with **performance, scalability, and user experience** in mind!

## 🛠️ Tech Stack

- **Frontend**: Next.js, TailwindCSS, shadcn-ui  
- **Backend**: tRPC, Prisma, PostgreSQL  
- **AI**: LangChain, Pinecone (Vector Storage)  
- **Authentication**: Kinde  
- **Payments**: Stripe (Free & Pro Plans)  
- **Other Features**:  
  - Infinite message loading  
  - Real-time streaming API responses  
  - PDF viewer  
  - Optimistic UI updates  
  - Drag-and-drop uploads  
  - Instant loading states  
- **Language**: 100% TypeScript  

## 🏃🏼‍➡️ Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/lottekvalheim/conversable.git
   ```

2. Navigate to the project directory:

    ```bash
    cd conversable
    ```

3. Install dependencies:

    ```bash
    pnpm install
    ```

4. Set up environment variables:

    ```bash
    cp .env.example .env.local
    ```

    Update the `.env.local` file with your own environment variables. Follow the `.env.example` file to configure your Kinde, Stripe, Pinecone, and database credentials.

5. Start the development server:

    ```bash
    pnpm dev
    ```

## 👋🏼 Developer Information

Conversable was built as a personal project to explore modern SaaS development with an emphasis on conversational AI and exceptional user experience. Feel free to explore, contribute, or reach out with feedback.

Created by Lotte Kvalheim | [GitHub](https://github.com/lottekvalheim) | [LinkedIn](https://www.linkedin.com/in/lotte-kvalheim/)
