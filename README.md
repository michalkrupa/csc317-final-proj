# Overview
This is the final project for CSC230 at SFSU.

[Deployment URL](https://curved-alike-sphere.glitch.me/)

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
1. DB should auto-init. If not, run `sqlite3 [env].db` 

### Deployment
1. Import repo to [Glitch](https://glitch.me/)
2. Configure the following `secrets` in Github:

```
GLITCH_GIT_URL # URL to Glitch git deployment
```

### Troubleshooting
* Ensure you are using [Glitch git url](https://github.com/marketplace/actions/sync-a-repo-branch-to-a-glitch-project-repo#usage) **NOT** the public-facing URL
* `[env]` referred to in [the DB Initialization](https://github.com/Ajmalmassoumy/csc317-final-proj#initializing-the-db) should match the variable set in your `.env` file
* Make sure you are using `development` or `production` as the `ENV` variable in your `.env` file - configuration in `app.js` depends on it

### TODO
1. Set `Deployment URL` in README to Glitch dev environment @Ajmalmassoumy
