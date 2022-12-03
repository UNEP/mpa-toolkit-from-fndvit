import { Construct } from 'constructs';
import type { aws_lambda_nodejs as lambdanode } from 'aws-cdk-lib';
import {
  aws_ec2 as ec2,
  aws_lambda as lambda,
  aws_cloudfront as cloudfront,
  aws_secretsmanager as secretsmanager,
  Duration
} from 'aws-cdk-lib';
import type { ConfigToEnvClean } from '@mpa/env';
import { getPath } from '../util/dirs';

export const SERVER_ENV_CONFIG = {
  PUBLIC_UPLOAD_BASE_URL: true,
  PUBLIC_GOOGLE_OAUTH_CLIENT_ID: true,
  GOOGLE_OAUTH_CLIENT_SECRET: true,
  DISABLE_CACHE: false,
  LOG_TRANSPORT: true,
  LOG_LEVEL: true
} as const;

export interface ServerProps {
  vpc: ec2.IVpc;
  appConfigLayer?: lambda.ILayerVersion;
  env: ConfigToEnvClean<typeof SERVER_ENV_CONFIG>;
}

type LambdaReferences = {
  fn: lambdanode.NodejsFunction;
  alias: lambda.Alias;
};

export class Server extends Construct {
  lambdaSg: ec2.SecurityGroup;
  lambdas: {
    api: LambdaReferences;
    cms: LambdaReferences;
    rest: LambdaReferences;
  };
  edgeFn: cloudfront.experimental.EdgeFunction;

  constructor(scope: Construct, id: string, props: ServerProps) {
    super(scope, id);

    const { vpc, env } = props;

    this.lambdaSg = new ec2.SecurityGroup(this, 'LambdaSG', { vpc });

    const secret = new secretsmanager.Secret(this, 'JWTSecret');

    const createNewServerFunction = (name: string) => {
      const fn = new lambda.Function(this, `Lambda-${name}`, {
        code: lambda.Code.fromAsset(getPath(`packages/web/.svelte-kit/lambda/${name}`)),
        handler: 'index.handler',
        tracing: lambda.Tracing.ACTIVE,
        memorySize: 256,
        timeout: Duration.seconds(15),
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
        },
        runtime: lambda.Runtime.NODEJS_16_X,
        securityGroups: [this.lambdaSg],
        environment: {
          ...env,
          JWT_SECRET_KEY: secret.secretValue.toString() // TODO: move to appConfig
        }
      });
      const alias = fn.addAlias(name);
      alias.addAutoScaling({ minCapacity: 1, maxCapacity: 50 }).scaleOnUtilization({ utilizationTarget: 0.5 });
      return { fn, alias };
    };

    this.lambdas = {
      api: createNewServerFunction('api'),
      cms: createNewServerFunction('cms'),
      rest: createNewServerFunction('rest')
    };

    this.edgeFn = new cloudfront.experimental.EdgeFunction(this, 'EdgeRouter', {
      code: new lambda.AssetCode(getPath('./packages/web/.svelte-kit/router')),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      memorySize: 128,
      timeout: Duration.seconds(1)
    });
  }
}
