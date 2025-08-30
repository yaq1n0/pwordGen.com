# pwordgen.com Frontend

A minimal, fast, client-side website that generates secure passwords using the `pwordgen` npm package.

## Features

- **Secure Password Generation**: Uses cryptographically strong randomness via the `pwordgen` package
- **Client-Side Only**: No data is sent to any server - everything runs in your browser
- **Customizable Options**: Control length, character types, exclusions, and requirements
- **Entropy Display**: Shows password strength in bits
- **URL Persistence**: Options are saved in URL parameters for easy sharing
- **Responsive Design**: Works on desktop and mobile devices
- **Accessible**: Keyboard navigation and screen reader friendly

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
npm install
```

### Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run tests in UI mode
npm run test:ui

# Type checking
npm run type-check

# Linting
npm run lint

# Code formatting
npm run prettier

# Build for production
npm run build

# Preview production build
npm run preview
```

### Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Vitest** - Fast unit testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Testing

The project includes comprehensive tests covering:

- Component rendering
- User interactions
- Password generation
- Option persistence
- Error handling
- Copy functionality

### Deployment

This project uses a two-stage GitHub Actions CI/CD pipeline:

#### 1. CI Workflow (`.github/workflows/ci.yml`)

Runs on every push and pull request to `main`:

- Type checking with TypeScript
- Code linting with ESLint
- Code formatting check with Prettier
- Unit tests with Vitest

#### 2. Publish Workflow (`.github/workflows/publish.yml`)

Runs automatically after CI completes successfully on `main`:

- Builds the production bundle
- Deploys to GitHub Pages

**To deploy:**

1. Push changes to `main` branch
2. CI workflow runs quality checks
3. If CI passes, publish workflow automatically deploys to GitHub Pages

### Security

- Uses Web Crypto API for secure random number generation
- No external dependencies for password generation
- No telemetry or analytics
- No network requests during password generation
- All processing happens client-side

## License

MIT
