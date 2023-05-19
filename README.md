# API Rate Limiter
API rate limiter is service for sending SMS and E-mail notifications. They are selling this service to different clients and each client has specific limits on the number of requests they can send in a month.

# Technologies
The Project is build by the use of the following technologies :
- `NodeJS` - A javascript server-side engine
- `Express`- A framework built on Node JS for building application program interface(API)
- `TypeScript` - Is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- `Redis(Remote Dictionary Server)` - Is a fast, open source, in-memory, key-value data store

# Tools and Modules
The tools and modules employed in this project are:
- Git
- npm

# Development Setup

**Clone repository**
- create a folder on local machine
- cd in to the folder and call a git init
- git clone this [Repository](https://github.com/Blaiseniyo/api-rate-limiter.git)

## Set up redis
```bash
$ docker run -d --name redis-server -p 6379:6379 redis
```
Then add the link to your local redis in the .env file, refer to .env-example
## Installation

Install dependencies using NPM. and the application

```
npm install
npm run dev // for development
npm run build & npm run start // for production
```

### Contributor
- Blaise Niyonkuru

### Author
- Blaise Niyonkuru