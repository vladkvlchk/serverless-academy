# Pro Shortlinker App

**Requirements**

To follow these instructions, you will need:

* Node.js version 12 or higher
* Serverless Framework version 2.50.0 or higher

**Preparing**

1. Before you deploy, download /node_modules:

```
npm install
```

2. Create `.env` file using `.env.example`

**Building the App**


Then, build the project by run-command:

```
npm run build
```

**Deploying the App**

To deploy the app, run the following command:

```
serverless deploy
```

This command will deploy the app to AWS.

**Conclusion**

For more information, visit the Serverless Framework documentation: https://www.serverless.com/framework/docs/.
------------------------------------------------------


## Folder structure

`/functions` - includes all lambda functions of the project. Here are all entrypoints of each process

`/services` - contains classes that are in charge of business logic

`/types` - exports custom types for typescript

`/validation` - functions app uses for validation

`/build` - built app version

**Files**
`src/aws.ts` - AWS classes (dynamoDB, SQS, SES)
`OpenAPI.json` - OpenAPI specification



