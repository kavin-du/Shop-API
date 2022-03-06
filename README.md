### to initialize ts configuration
`npx tsc --init`

### install typescript and ts-node as dev dependencies
`npm add -D typescript ts-node`

### install nodemon
`npm add -D nodemon`

### modify package.json to auto reload
```
"scripts": {
   "dev": "nodemon ./src/index.ts"
 }
```

###  install typac to automatically install @types in dev dependencies
`npm install -g typac`

### using typac to install dependencies
`typac <pkg-name>`

###  logging related
`dayjs, pino, pino-pretty`

### add to `.env` file
```
PORT=3000
JWT_KEY=myjwtkeysecret
```