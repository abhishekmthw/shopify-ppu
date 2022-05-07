import AWS from "aws-sdk";

ANS.config.update({
  credentials: {
    accesskeyId: process.env.APP_AWS_ACCESS_KEY,
    secretAccesskey: process.env.APP_AWS_SECRET_KEY,
  },
});

const ddb = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMODB_REGION,
});

export default ddb;
