## API regression tester

This project powered by Node.js, TypeScript and Fastify is experimental. 

### Goal

- Detect regressions between 2 versions of an API server.
- Support fuzzy equality for some data.
- Allow custom matchers.
- Studying opportunities for custom matchers generation with AI.

### Installation

Install dependencies:

```bash
pnpm install
```

### API servers

Two API servers are provided for demo purpose: a legacy version, and an actual version.
The legacy server listens to port 3000, and the actual one listens to port 3001.

Run the two API servers in dev mode:

```bash
pnpm run dev
```

### Regression test

Run the regression tests:

```bash
pnpm test
```

### Environment variables

- LEGACY_BASE_URL (default: http://localhost:3000): Base URL of the legacy API server.
- LOCAL_API (boolean): Use local API servers.
- MOCK (boolean): Use API mock in regression tests.
- ACTUAL_BASE_URL (default: http://localhost:3001): Base URL of the actual API server.
- OPENAI_API_KEY: Open AI API key.
- TIMEOUT (number): Request timeout.
- VERBOSE (boolean): Enable verbose logs.

### Demo

#### Play with API servers

- Run the servers:
    ```bash
    pnpm run dev
    ```
- Consume legacy server API:
    ```bash
    http :3000/api/books
    ```
- Consume actual server API:
    ```bash
    http :3001/api/books
    ```

#### Run regression tests

```bash
pnpm test
```

> The API servers will be automatically started before running the tests: in case you launched an API server maanually, please stop before running the tests.

#### Simulate a breaking change & fix it

- Checkout the `wip` branch.
- Have a look to git diffs.
- Run the test harness: it should fail because of new fields not matching.
- Fix the matchers with the help of AI:
    ```bash
    pnpm run generate:code
    ```
    This script will submit a prompt to ChatGPT and generate a new version of `src/tests/matchers/object-diff.helper.ts` providing a fix to make the test pass again.
- Have a look at your git stage to see the generated fix.
- Run the test harness again: it should be back to green.

> Prerequisite: Set OPENAI_API_KEY env var (for example into `.env.local`) with your OpenAI API key value. 

Enjoy!
