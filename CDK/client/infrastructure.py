import aws_cdk.core as cdk
import aws_cdk.aws_amplify as amplify


class AmplifyInfraStack(cdk.Stack):

    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # The full ARN of a plaintext secret in AWS Secret Manager
        # containing a personal Github access token valid for this repo
        token_secret_ARN = ""

        amplify_app = amplify.App(self, "machine-spraak-client",
                                  source_code_provider=amplify.GitHubSourceCodeProvider(
                                      owner="solita",
                                      repository="machine-spraak-client",
                                      oauth_token=cdk.SecretValue.secrets_manager(
                                          secret_id=token_secret_ARN
                                      )
                                  ),)

        main = amplify_app.add_branch("main")
