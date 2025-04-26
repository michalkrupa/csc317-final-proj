# Overview
This is the final project for CSC230 at SFSU.

## Getting Started
### Installing Dependencies
Please ensure the below packages are installed on your
system before running the project:

* Node (v16.x)
* NPM (10.9.2)
* SQLite3 (3.49.1)

### Local Development
1. Copy `.env.example` to `.env`
2. Replace local variables
3. Let's party 🎉

### Starting the Application
1. Run `npm install` from `<project_root>`
2. After installation, run `npm run dev`
3. Navigate to `http://localhost:3000`

### Initializing the DB
1. Run `sqlite3 db-[env].db` 

### Deployment
1. Import repo to [Glitch](https://glitch.me/)
2. Configure the following `secrets` in Github:

```
GlitchGitURL # URL to Glitch deployment
GITHUB_TOKEN # Personal token generated from Github settings
```