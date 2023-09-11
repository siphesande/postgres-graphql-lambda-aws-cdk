import { Construct } from "constructs";
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';


export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const graphqlLambda = new NodejsFunction(this, "graphqlLambda", {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: "src/lambda.ts",
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    });

    const api = new LambdaRestApi(this, "graphqlEndpoint", {
      handler: graphqlLambda,
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'X-Api-Key',
          'X-Amz-Date',
          'Content-Type',
          'Authorization',
        ],
        allowMethods: ['OPTIONS', 'POST'],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000', 'http://localhost:5432' ],
      },
    });

    // Output for the API URL
    new CfnOutput(this, 'apiUrl', { value: api.url });
  }
}








