import { Construct } from 'constructs';
import type { aws_lambda_nodejs as lambdanode } from 'aws-cdk-lib';
import { aws_ec2 as ec2, Duration, aws_lambda as lambda, SymlinkFollowMode } from 'aws-cdk-lib';
import type { ConfigToEnvClean } from '@mpa/env/env';
import { getPath } from '../util/dirs';

export const MIGRATION_RUNNER_ENV_CONFIG = {
  LOG_TRANSPORT: true,
  LOG_LEVEL: true
} as const;

export interface MigrationRunnerProps {
  vpc: ec2.IVpc;
  env: ConfigToEnvClean<typeof MIGRATION_RUNNER_ENV_CONFIG>;
}

export class MigrationRunner extends Construct {
  securityGroup: ec2.SecurityGroup;
  lambda: lambdanode.NodejsFunction;

  constructor(scope: Construct, id: string, props: MigrationRunnerProps) {
    super(scope, id);

    const { vpc, env } = props;

    this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', { vpc });

    this.lambda = new lambda.Function(this, 'Lambda', {
      tracing: lambda.Tracing.ACTIVE,
      memorySize: 256,
      timeout: Duration.seconds(20),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED
      },
      runtime: lambda.Runtime.NODEJS_16_X,
      environment: env,
      securityGroups: [this.securityGroup],

      code: lambda.Code.fromAsset(getPath('packages/migration-runner/dist'), {}),
      handler: 'migration-runner.handler'
    });
  }
}
