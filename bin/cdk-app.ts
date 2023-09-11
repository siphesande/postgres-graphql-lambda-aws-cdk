#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from "aws-cdk-lib";
import * as dotenv from 'dotenv';
import { AppStack } from '../lib/app';

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const YOUR_AWS_REGION = process.env.YOUR_AWS_REGION;

const app = new cdk.App();
new AppStack(app, 'AppStack', {
    env: {
        account: AWS_ACCOUNT_ID,
        region: YOUR_AWS_REGION,
    },
    
});