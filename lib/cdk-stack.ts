import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Runtime, Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { join } from 'path';
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class CdkStack extends Stack {

  private api = new RestApi(this, 'MagnetoApi');
  // private table = new GenericTable(
  //   'MagnetoTable',
  //   'id',
  //   this
  // )

  private magnetoTable = new GenericTable(this, {
    tableName: 'MagnetoTable',
    primaryKey: 'id',
    createLambdaPath: 'Create',
    readLambdaPath: 'Read'
  })

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
      entry: (join(__dirname, '..', 'service', 'node-lambda', 'hello.ts')),
      handler: 'handler'
    })

    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions('s3:ListAllMyBuckets');
    s3ListPolicy.addResources('*');
    helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);


    const lambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    const lambdaResourse = this.api.root.addResource('hello');
    lambdaResourse.addMethod('GET', lambdaIntegration);

    const magnetoResource = this.api.root.addResource('axioms');
    magnetoResource.addMethod('POST', this.magnetoTable.createLambdaIntegration);
    magnetoResource.addMethod('GET', this.magnetoTable.readLambdaIntegration)
    
  }
}
