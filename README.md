# ExportCheck
ExportCheck is a professional compliance decision engine that helps legal arms dealers, manufacturers, and compliance officers quickly determine U.S. export control obligations. Built for the defense industry, it eliminates Excel guesswork with clean, auditable logic and real-world component intelligence.

# ExportCheck

**ExportCheck** is a professional compliance decision engine designed to help legal arms dealers, manufacturers, and compliance officers quickly determine U.S. export control obligations. Built for the defense industry, it eliminates Excel guesswork with clean, auditable logic and real-world component intelligence.

---

## Table of contents

* [About](#about)
* [Features](#features)
* [Quickstart](#quickstart)
* [Install & Run (Development)](#install--run-development)
* [Docker (optional)](#docker-optional)
* [Usage Examples](#usage-examples)

  * [CLI (example)](#cli-example)
  * [HTTP API (example)](#http-api-example)
* [Configuration](#configuration)
* [Architecture & File Structure](#architecture--file-structure)
* [Testing](#testing)
* [Security & Compliance Notes](#security--compliance-notes)
* [Contributing](#contributing)
* [Roadmap](#roadmap)
* [License](#license)
* [Contact](#contact)

---

## About

ExportCheck is a TypeScript-based engine (frontend/backend tooling in the repository) for encoding export-control decision logic, validating inputs, and producing auditable outcomes that a compliance officer can use as part of a records trail. The project prioritizes:

* Deterministic decision logic that can be reviewed and audited.
* Reproducible inputs/outputs (JSON-based payloads, logs and decision records).
* Extensibility for new rules, lists, or jurisdictional policies.

## Features

* Rule-driven decision engine (policy rules expressed in code/JSON).
* REST API for evaluating shipments/components.
* CLI tooling for batch evaluation and local testing.
* Logging and exportable audit trail for each decision.
* Simple data model for components, destinations, end-uses and parties.
* Ready-to-extend TypeScript codebase.

## Quickstart

Prerequisites:

* Node.js (16+ recommended)
* npm or yarn
* Docker (optional, for containerized runs)

Quick steps (development):

```bash
# clone the repo
git clone https://github.com/Al-deberan/ExportCheck.git
cd ExportCheck

# install dependencies
npm install

# build (if applicable)
npm run build

# start dev server (example)
npm run dev
```

> These commands are example conventions. Replace `npm run dev` with the actual dev script in the repository (e.g. `npm run start:dev`).

## Install & Run (Development)

1. `git clone https://github.com/Al-deberan/ExportCheck.git`
2. `cd ExportCheck`
3. `npm ci` (or `npm install`)
4. `npm run build` (optional)
5. `npm run start` or `npm run dev`

If you use `yarn`:

```bash
yarn install
yarn build
yarn start
```

## Docker (optional)

A `Dockerfile` is a convenient way to run ExportCheck in a container. Example Dockerfile pattern:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "dist/index.js"]
```

Build & run:

```bash
docker build -t exportcheck:latest .
docker run -p 3000:3000 --env-file .env exportcheck:latest
```

## Usage Examples

The repository contains a TypeScript codebase that can be used either as a library or an HTTP service. Below are example patterns you can copy into your app or use with `curl`.

### CLI (example)

```bash
# evaluate a single component described in JSON
node ./dist/cli.js evaluate --input payloads/sample-ship.json
```

### HTTP API (example)

An example `POST /api/v1/evaluate` that evaluates an object read and returns a decision:

```bash
curl -X POST \
  http://localhost:3000/api/v1/evaluate \
  -H 'Content-Type: application/json' \
  -d '{
    "component": { "name": "gyro-module", "partNumber": "G-123", "technicalData": { "rpm": 12000 } },
    "destination": "Germany",
    "endUse": "industrial guidance",
    "endUser": { "name": "Acme Aerospace", "country": "DE" }
  }'
```

Example JSON response (auditable):

```json
{
  "decisionId": "dec_20251231_0001",
  "allowed": false,
  "reasons": [
    "Component meets ECCN 7A994 (example)",
    "Destination requires license per USML/ITAR check"
  ],
  "rulesMatched": ["eccn-lookup-v1","destination-list-2025"],
  "timestamp": "2025-12-31T12:34:56Z"
}
```

## Configuration

The engine should be configurable through environment variables and local config files. Suggested configuration keys:

* `PORT` — http server port (default: 3000)
* `NODE_ENV` — development/production
* `LOG_LEVEL` — debug/info/warn/error
* `RULES_DIR` — directory containing JSON/TS rule definitions
* `AUDIT_DIR` — directory to write auditable decision logs

Store secret keys (if any) in `.env` and **never** commit secrets to git.

## Architecture & File Structure (Suggested)

```
ExportCheck/
├── src/
│   ├── api/                # HTTP handlers (Express/Fastify)
│   ├── cli/                # CLI entrypoints
│   ├── engine/             # Core decision engine and rule evaluator
│   ├── data/               # Reference lists, sample payloads
│   ├── rules/              # Rule definitions (JSON or TS)
│   └── utils/              # helpers, logging, auditing
├── test/                   # unit & integration tests
├── dist/                   # built artifacts
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

If the repository already contains a slightly different layout, adapt this structure while preserving clear separation between engine logic, API surface, and rules data.

## Testing

Recommended testing approach:

* Unit tests for rule evaluation (mock inputs + expected boolean/structured output).
* Integration tests that run the HTTP server and assert API responses.

Example commands:

```bash
npm run test
npm run test:watch
```

## Security & Compliance Notes

* This project **does not** and **should not** represent legal advice. It's a technical compliance *tool* that helps produce auditable outputs — any legal determination must be made by qualified counsel.
* Keep decision rules under version control and record the rule-set version with every decision for auditability.
* Protect personal data and export-control sensitive datasets; follow your organisation's policies for access control and data retention.

## Contributing

Thanks for the help! When contributing:

1. Open an issue describing the problem or feature.
2. Create a small, focused branch: `feat/<short-description>` or `fix/<short-description>`.
3. Add tests that demonstrate the expected behavior.
4. Submit a PR with a clear description of changes.

Be mindful of the sensitive nature of export-control logic: avoid committing private rule/data files or proprietary lists.

## Roadmap (example)

* [ ] Add standardized ECCN/USML data ingestion module
* [ ] Add policy-versioning and decision snapshots (immutable storage)
* [ ] Add role-based UI for compliance officers
* [ ] Add packaging as an on-premise appliance (installer/Docker Compose)

## License

This repository is published under the **MIT License**.

## Contact

For questions and collaboration, open an issue in the repository or contact the maintainer listed on the GitHub profile.

---

*Prepared as a full-featured README for ExportCheck — adapt any sample commands, ports, or script names to match the repository's actual scripts and file names.*
