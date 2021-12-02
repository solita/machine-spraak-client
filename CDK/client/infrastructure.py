from aws_cdk import core as cdk
from aws_cdk import aws_amplify as amplify
from aws_cdk import aws_s3 as s3
from aws_cdk import aws_lambda as _lambda
from aws_cdk import aws_dynamodb as dynamodb
from aws_cdk import aws_apigateway as apigw


class MachineSpraakInfraStackTest(cdk.Stack):

    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Define stage
        api_stage_options = apigw.StageOptions(stage_name="dev")

        # Create base api
        base_api = apigw.RestApi(self, 'MachineSpraakApiGWTest',
                                 rest_api_name='machinespraak_api',
                                 description='Fetch data from DynamoDB',
                                 deploy_options=api_stage_options
                                 )

        # Create a resource named items on the base API
        audio_analysis = base_api.root.add_resource('audio_analysis')

        # Defines an AWS Lambda resource
        api_lambda = _lambda.Function(
            self, 'MachineSpraakAppLambdaTest',
            runtime=_lambda.Runtime.PYTHON_3_7,
            code=_lambda.Code.from_asset('lambda'),
            handler='hello.handler',
        )

        # Create lambda integration
        lambda_integration = apigw.LambdaIntegration(api_lambda)

        audio_analysis.add_method("GET",
                                  lambda_integration
                                  # api_key_required = True, # Uncommwent this and
                                  )

        bucket = s3.Bucket(self,
                           "MachineSpraakAppBucketTest",
                           versioned=True,
                           removal_policy=cdk.RemovalPolicy.DESTROY,
                           auto_delete_objects=True)

        # Create table for metadata
        audio_metadata_table = dynamodb.Table(self, "MachinespraakAppMetadataTest",
                                              table_name="MachinespraakAppMetadataTest",
                                              partition_key=dynamodb.Attribute(
                                                  name="audio_id", type=dynamodb.AttributeType.STRING),
                                              billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
                                              removal_policy=cdk.RemovalPolicy.DESTROY,
                                              sort_key=dynamodb.Attribute(
                                                  name="metadata", type=dynamodb.AttributeType.STRING)
                                              )

        api_lambda.add_environment(
            "TABLE_NAME", audio_metadata_table.table_name)
        api_lambda.add_environment("BUCKET_NAME", bucket.bucket_name)
        audio_metadata_table.grant_write_data(api_lambda)
        audio_metadata_table.grant_read_data(api_lambda)
        bucket.grant_read_write(api_lambda)

        # The full ARN of a plaintext secret in AWS Secret Manager
        # containing a personal Github access token valid for this repo
        token_secret_ARN = ""

        # ApiGW endpoint
        apigw_URL = base_api.url

        amplify_app = amplify.App(self, "machine-spraak-client",
                                  source_code_provider=amplify.GitHubSourceCodeProvider(
                                      owner="solita",
                                      repository="machine-spraak-client",
                                      oauth_token=cdk.SecretValue.secrets_manager(
                                          secret_id=token_secret_ARN
                                      )
                                  ), environment_variables={"API_URL": apigw_URL},)

        amplify_app.add_branch("api-test")
