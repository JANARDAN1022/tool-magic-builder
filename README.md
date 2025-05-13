# MagicTools

MagicTools is a modern web application designed to help users manage and visualize their tools and data effectively. It leverages AI-powered features for generating tool descriptions and creating insightful visualizations.

## Features

- **AI-Powered Tool Descriptions**: Automatically generate detailed tool schemas using GROQ and Gemini APIs.
- **Data Visualizations**: Visualize your data with interactive charts and graphs.
- **User-Friendly Interface**: Intuitive design for seamless user experience.
- **State Management**: Optimized state handling for better performance.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd MagicTools
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:

   ```env
   VITE_GROQ_API_KEY=<your-groq-api-key>
   VITE_GEMINI_API_KEY=<your-gemini-api-key>
   VITE_GROQ_DEFAULT_MODEL=<default-model>
   VITE_GROQ_MODELS=<available-models>
   ```

4. **Start the Development Server**:

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

5. **Build for Production**:
   To create a production build, run:

   ```bash
   npm run build
   ```

   or

   ```bash
   yarn build
   ```

## Folder Structure

```
MagicTools/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and configurations
│   ├── pages/           # Application pages
│   ├── providers/       # Context providers
│   └── services/        # API and service integrations
├── .env                 # Environment variables
├── package.json         # Project metadata and scripts
└── README.md            # Project documentation
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Push your branch and create a pull request.

## Production URL

Live URL:-
https://toolsmagic.netlify.app/
