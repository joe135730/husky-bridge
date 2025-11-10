# Husky Bridge Frontend

Husky Bridge Backend:　https://github.com/joe135730/husky-bridge-server

A modern React-based frontend application built with TypeScript, Vite, and React Router.

## 🚀 Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 6
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM 7.5.2
- **UI Components**: React Bootstrap
- **Icons**: Font Awesome
- **HTTP Client**: Axios
- **Code Quality**: ESLint, TypeScript ESLint

## 📦 Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd husky-bridge
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## 🏃‍♂️ Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## 🔍 Code Quality

Run linting:

```bash
npm run lint
# or
yarn lint
```

## 🎯 Project Structure

```
husky-bridge/
├── src/               # Source files
├── public/           # Static files
├── dist/             # Build output
├── package.json      # Project dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## 🔐 Security

This project uses the latest secure versions of dependencies, including:
- React Router DOM 7.5.2+ (patched against pre-render data spoofing vulnerability)
- Regular security updates through npm/yarn

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

