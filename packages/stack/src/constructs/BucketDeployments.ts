import { Construct } from 'constructs';
import type { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_s3_deployment as s3_deployment } from 'aws-cdk-lib';
import { getPath } from '../util/dirs';

export interface BucketDeploymentsProps {
  buckets: {
    static: s3.Bucket;
  };
}

export class BucketDeployments extends Construct {
  constructor(scope: Construct, id: string, props: BucketDeploymentsProps) {
    super(scope, id);

    const { buckets } = props;

    const assetsDir = getPath('packages/web/.svelte-kit/client');

    new s3_deployment.BucketDeployment(this, 'Immutable', {
      destinationBucket: buckets.static,
      sources: [s3_deployment.Source.asset(`${assetsDir}/_app`)],
      destinationKeyPrefix: '_app/',
      cacheControl: [s3_deployment.CacheControl.fromString('max-age=31536000, public, immutable')],
      retainOnDelete: false,
      prune: false // TODO: delayed pruning (for seamless deployments)
    });

    new s3_deployment.BucketDeployment(this, 'Static', {
      destinationBucket: buckets.static,
      sources: [s3_deployment.Source.asset(assetsDir, { exclude: ['_app/*'] })],
      cacheControl: [s3_deployment.CacheControl.fromString('max-age=3600, public')],
      retainOnDelete: true,
      prune: true,
      exclude: ['_app', '_app/', '_app/*']
    });
  }
}
