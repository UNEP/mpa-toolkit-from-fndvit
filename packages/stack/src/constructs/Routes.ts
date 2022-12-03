import { Construct } from 'constructs';
import type { aws_s3 as s3 } from 'aws-cdk-lib';
import { HttpApi, HttpMethod, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import type { Server } from './Server';
import mapValues from 'lodash/mapValues.js';

export interface WebDistributionProps {
  server: Server;
  buckets: {
    static: s3.IBucket;
    upload: s3.IBucket;
  };
}

export class Routes extends Construct {
  httpApi: HttpApi;

  constructor(scope: Construct, id: string, props: WebDistributionProps) {
    super(scope, id);

    const { server } = props;

    this.httpApi = new HttpApi(this, 'HttpApi');

    const integrations = mapValues(
      server.lambdas,
      ({ alias }) =>
        new HttpLambdaIntegration(`LambdaIntegration-${alias.aliasName}`, alias, {
          payloadFormatVersion: PayloadFormatVersion.VERSION_1_0
        })
    );

    this.httpApi.addRoutes({
      path: '/cms',
      methods: [HttpMethod.GET],
      integration: integrations.cms
    });
    this.httpApi.addRoutes({
      path: '/cms/{proxy+}',
      methods: [HttpMethod.GET],
      integration: integrations.cms
    });
    this.httpApi.addRoutes({
      path: '/api',
      methods: [HttpMethod.ANY],
      integration: integrations.api
    });
    this.httpApi.addRoutes({
      path: '/api/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: integrations.api
    });
    this.httpApi.addRoutes({
      path: '/globe.svg',
      methods: [HttpMethod.GET],
      integration: integrations.api
    });

    this.httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: integrations.rest
    });
  }
}
