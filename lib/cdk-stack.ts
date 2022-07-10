import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizationType, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { join } from 'path';
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AuthorizerWrapper } from './Auth/AuthorizerWrapper';

export class CdkStack extends Stack {

  private api = new RestApi(this, 'MagnetoApi');
  private authorizer: AuthorizerWrapper;

  private magnetoTable = new GenericTable(this, {
    tableName: 'MagnetoTable',
    primaryKey: 'id',
    createLambdaPath: 'Create',
    readLambdaPath: 'Read',
    updateLambdaPath: 'Update',
    deleteLambdaPath: 'Delete',
    secondaryIndexes: ['location']
  })

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.authorizer = new AuthorizerWrapper(this, this.api);

    const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
      entry: (join(__dirname, '..', 'service', 'node-lambda', 'hello.ts')),
      handler: 'handler'
    })

    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions('s3:ListAllMyBuckets');
    s3ListPolicy.addResources('*');
    helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);

    const optionsWithAuthorizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer:{
        authorizerId: this.authorizer.authorizer.authorizerId
      }
    }

    const lambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    const lambdaResourse = this.api.root.addResource('hello');
    lambdaResourse.addMethod('GET', lambdaIntegration, optionsWithAuthorizer);

    const magnetoResource = this.api.root.addResource('axioms');
    magnetoResource.addMethod('POST', this.magnetoTable.createLambdaIntegration);
    magnetoResource.addMethod('GET', this.magnetoTable.readLambdaIntegration)
    magnetoResource.addMethod('PUT', this.magnetoTable.updateLambdaIntegration)
    magnetoResource.addMethod('DELETE', this.magnetoTable.deleteLambdaIntegration)
    
  }
}
