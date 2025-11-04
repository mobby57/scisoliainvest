# Tutorial Expert: Using IAM Identity Center with Advanced IoT Core Resources for SCI Soliai Invest

This expert-level tutorial describes how to configure the AWS CLI to authenticate users with AWS IAM Identity Center and manage advanced IoT Core resources for the SCI Soliai Invest platform, including device fleets, jobs, and real-time analytics.

## Topics
- Step 1: Authentication in IAM Identity Center for SCI Soliai Invest
- Step 2: Gather your IAM Identity Center information
- Step 3: Create Advanced SCI IoT Core Infrastructure
- Step 4: Install the AWS CLI
- Step 5: Configure your AWS CLI profile
- Step 6: Log in to IAM Identity Center
- Step 7: Deploy IoT Device Fleet Management
- Step 8: Configure Real-time Analytics Pipeline
- Step 9: Run Advanced SCI IoT Commands
- Step 10: Log out of IAM Identity Center
- Step 11: Clean up resources

## Step 1: Authentication in IAM Identity Center for SCI Soliai Invest

Gain access to SSO authentication within IAM Identity Center. Choose one of the following methods to access your AWS credentials for SCI Soliai Invest.

### I do not have established access through IAM Identity Center
Follow the instructions in Getting started in the AWS IAM Identity Center User Guide. This process activates IAM Identity Center, creates an administrative user, and adds an appropriate least-privilege permission set.

**Note**
Create a permission set that applies least-privilege permissions. For SCI Soliai Invest IoT operations, we recommend:
- `SCI-IoT-Developers-Dev`: IoT development and testing
- `SCI-IoT-Engineers-Prod`: Production IoT fleet management
- `SCI-DevOps-Prod`: Full production infrastructure management

### I already have access to AWS through a federated identity provider managed by my employer (such as Azure AD or Okta)
Sign in to AWS through your identity provider's portal. If your Cloud Administrator has granted you SCI-specific permissions, you see the AWS accounts that you have access to and your permission set. Next to the name of your permission set, you see options to access the accounts manually or programmatically using that permission set.

Custom implementations might result in different experiences, such as different permission set names. If you're not sure which permission set to use, contact your IT team for help. Common SCI permission sets include:
- `SCI-IoT-Developers-Dev`: IoT Core, Device Management, Analytics
- `SCI-IoT-Engineers-Prod`: Production IoT fleet operations
- `SCI-Frontend-Devs`: Frontend resources (S3, CloudFront)
- `SCI-Backend-Devs`: Backend services (RDS, Lambda, API Gateway)
- `SCI-DevOps-Prod`: Full infrastructure management

### I already have access to AWS through the AWS access portal managed by my employer
Sign in to AWS through your AWS access portal. If your Cloud Administrator has granted you SCI permissions, you see the AWS accounts that you have access to and your permission set. Next to the name of your permission set, you see options to access the accounts manually or programmatically using that permission set.

### I already have access to AWS through a federated custom identity provider managed by my employer

## Step 2: Gather your IAM Identity Center information

After gaining access to AWS, gather your IAM Identity Center information by performing the following:

Gather your SSO Start URL and SSO Region values that you need to run aws configure sso

In your AWS access portal, select the permission set you use for SCI development, and select the Access keys link.

In the Get credentials dialog box, choose the tab that matches your operating system.

Choose the IAM Identity Center credentials method to get the SSO Start URL and SSO Region values.

Alternatively, starting with version 2.22.0, you can use the new Issuer URL instead of the Start URL. The Issuer URL is located in the AWS IAM Identity Center console in one of the following locations:

On the Dashboard page, the Issuer URL is in the settings summary.

On the Settings page, the Issuer URL is in the Identity source settings.

For information on which scopes value to register, see OAuth 2.0 Access scopes in the IAM Identity Center User Guide.

## Step 3: Create Advanced SCI IoT Core Infrastructure

Sign in to the AWS Management Console and create the following advanced IoT resources for SCI Soliai Invest:

### Create IoT Core Thing Types and Groups
```bash
# Advanced sensor types
aws iot create-thing-type --thing-type-name SCI-Environmental-Sensor \
  --thing-type-description "Environmental sensors for property monitoring"
aws iot create-thing-type --thing-type-name SCI-Security-Camera \
  --thing-type-description "Security cameras with AI analytics"
aws iot create-thing-type --thing-type-name SCI-Smart-Lock \
  --thing-type-description "Smart locks for property access control"

# Create thing groups for fleet management
aws iot create-thing-group --thing-group-name SCI-Property-Fleet-Prod
aws iot create-thing-group --thing-group-name SCI-Property-Fleet-Dev
```

### Create Advanced IoT Policies
```bash
# Device policy with advanced permissions
aws iot create-policy --policy-name SCI-IoT-Device-Policy --policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Connect",
        "iot:Publish",
        "iot:Subscribe",
        "iot:Receive"
      ],
      "Resource": [
        "arn:aws:iot:*:*:client/sci-${iot:Connection.Thing.ThingName}",
        "arn:aws:iot:*:*:topic/sci/properties/${iot:Connection.Thing.ThingName}/*",
        "arn:aws:iot:*:*:topicfilter/sci/properties/${iot:Connection.Thing.ThingName}/*"
      ]
    }
  ]
}'

# Fleet provisioning policy
aws iot create-policy --policy-name SCI-Fleet-Provisioning-Policy --policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:CreateKeysAndCertificate",
        "iot:CreateThing",
        "iot:AttachThingPrincipal",
        "iot:AttachPolicy"
      ],
      "Resource": "*"
    }
  ]
}'
```

### Create IoT Rules for Data Processing
```bash
# Rule for environmental data processing
aws iot create-topic-rule --rule-name SCI_Environmental_Data_Rule --topic-rule-payload '{
  "sql": "SELECT *, timestamp() as aws_timestamp FROM 'sci/properties/+/environmental'",
  "description": "Process environmental sensor data",
  "actions": [
    {
      "timestream": {
        "roleArn": "arn:aws:iam::ACCOUNT:role/SCI-IoT-Timestream-Role",
        "databaseName": "SCI_Properties",
        "tableName": "EnvironmentalData"
      }
    }
  ]
}'

# Rule for security alerts
aws iot create-topic-rule --rule-name SCI_Security_Alerts_Rule --topic-rule-payload '{
  "sql": "SELECT * FROM 'sci/properties/+/security' WHERE alert_level > 3",
  "description": "Process high-priority security alerts",
  "actions": [
    {
      "sns": {
        "targetArn": "arn:aws:sns:eu-west-1:ACCOUNT:SCI-Security-Alerts",
        "roleArn": "arn:aws:iam::ACCOUNT:role/SCI-IoT-SNS-Role"
      }
    }
  ]
}'
```

### Create Timestream Database for IoT Analytics
```bash
# Create Timestream database
aws timestream-write create-database --database-name SCI_Properties

# Create tables for different data types
aws timestream-write create-table \
  --database-name SCI_Properties \
  --table-name EnvironmentalData \
  --retention-properties MemoryStoreRetentionPeriodInHours=24,MagneticStoreRetentionPeriodInDays=365

aws timestream-write create-table \
  --database-name SCI_Properties \
  --table-name SecurityEvents \
  --retention-properties MemoryStoreRetentionPeriodInHours=168,MagneticStoreRetentionPeriodInDays=2555
```

### Create S3 buckets for IoT data and OTA updates
```bash
aws s3 mb s3://sci-iot-data-lake-prod
aws s3 mb s3://sci-iot-firmware-updates
aws s3 mb s3://sci-property-documents-prod
```

## Step 4: Install the AWS CLI

Install the AWS CLI following the instructions for your operating system. For more information, see Installing or updating to the latest version of the AWS CLI.

Once installed, you can verify the installation by opening your preferred terminal and running the following command. This should display your installed version of the AWS CLI.

```bash
aws --version
```

## Step 5: Configure your AWS CLI profile

Configure your profile using one of the following methods

### Configure your profile with the aws configure sso wizard
```bash
aws configure sso
```

Follow the prompts:
- SSO session name: sci-dev-session
- SSO Start URL: [Your SSO Start URL from Step 2]
- SSO Region: [Your SSO Region from Step 2]
- SSO registration scopes: sso:account:access (default)

Select the appropriate account and SCI permission set (e.g., SCI-Developers-Dev).

### Manual configuration using the config file
Edit your `~/.aws/config` file:

```ini
[profile sci-dev-profile]
sso_session = sci-dev-session
sso_account_id = YOUR_ACCOUNT_ID
sso_role_name = SCI-Developers-Dev
region = eu-west-1
output = json

[sso-session sci-dev-session]
sso_start_url = https://your-sso-start-url
sso_region = eu-west-1
sso_registration_scopes = sso:account:access
```

## Step 6: Log in to IAM Identity Center

**Note**
The sign in process may prompt you to allow the AWS CLI access to your data. Since the AWS CLI is built on top of the SDK for Python, permission messages may contain variations of the botocore name.

To retrieve and cache your IAM Identity Center credentials, run the following command for the AWS CLI to open your default browser and verify your IAM Identity Center log in.

```bash
aws sso login --profile sci-dev-profile
```

Starting with version 2.22.0, PKCE authorization is the default. To use device authorization for signing in, add the --use-device-code option.

```bash
aws sso login --profile sci-dev-profile --use-device-code
```

## Step 7: Deploy IoT Device Fleet Management

### Create Fleet Provisioning Template
```bash
aws iot create-provisioning-template \
  --template-name SCI-Property-Device-Template \
  --description "Fleet provisioning for SCI property devices" \
  --provisioning-role-arn arn:aws:iam::ACCOUNT:role/SCI-Fleet-Provisioning-Role \
  --template-body '{
    "Parameters": {
      "PropertyId": {"Type": "String"},
      "DeviceType": {"Type": "String"}
    },
    "Resources": {
      "thing": {
        "Type": "AWS::IoT::Thing",
        "Properties": {
          "ThingName": {"Fn::Join": ["-", ["sci", {"Ref": "PropertyId"}, {"Ref": "DeviceType"}]]},
          "ThingTypeName": {"Ref": "DeviceType"},
          "ThingGroups": ["SCI-Property-Fleet-Prod"]
        }
      },
      "certificate": {
        "Type": "AWS::IoT::Certificate",
        "Properties": {
          "CertificateId": {"Ref": "AWS::IoT::Certificate::Id"},
          "Status": "ACTIVE"
        }
      },
      "policy": {
        "Type": "AWS::IoT::Policy",
        "Properties": {
          "PolicyName": "SCI-IoT-Device-Policy"
        }
      }
    }
  }' \
  --enabled
```

### Create OTA Update Job
```bash
# Create job document for firmware update
aws iot create-job \
  --job-id SCI-Firmware-Update-v2.1.0 \
  --targets arn:aws:iot:eu-west-1:ACCOUNT:thinggroup/SCI-Property-Fleet-Prod \
  --document-source s3://sci-iot-firmware-updates/firmware-v2.1.0.json \
  --description "Security patch and performance improvements" \
  --target-selection SNAPSHOT
```

## Step 8: Configure Real-time Analytics Pipeline

### Create Kinesis Data Streams
```bash
# Stream for real-time IoT data
aws kinesis create-stream \
  --stream-name SCI-IoT-RealTime-Stream \
  --shard-count 2

# Stream for processed analytics
aws kinesis create-stream \
  --stream-name SCI-Analytics-Output-Stream \
  --shard-count 1
```

### Create Kinesis Analytics Application
```bash
aws kinesisanalytics create-application \
  --application-name SCI-Property-Analytics \
  --application-description "Real-time analytics for property IoT data" \
  --inputs '[{
    "NamePrefix": "SOURCE_SQL_STREAM",
    "KinesisStreamsInput": {
      "ResourceARN": "arn:aws:kinesis:eu-west-1:ACCOUNT:stream/SCI-IoT-RealTime-Stream",
      "RoleARN": "arn:aws:iam::ACCOUNT:role/SCI-Kinesis-Analytics-Role"
    },
    "InputSchema": {
      "RecordColumns": [
        {"Name": "property_id", "SqlType": "VARCHAR(32)"},
        {"Name": "device_type", "SqlType": "VARCHAR(32)"},
        {"Name": "temperature", "SqlType": "DOUBLE"},
        {"Name": "humidity", "SqlType": "DOUBLE"},
        {"Name": "timestamp", "SqlType": "TIMESTAMP"}
      ],
      "RecordFormat": {"RecordFormatType": "JSON"}
    }
  }]'
```

## Step 9: Run Advanced SCI IoT Commands

### Monitor Device Fleet Status
```bash
# List all devices in production fleet
aws iot list-things-in-thing-group \
  --thing-group-name SCI-Property-Fleet-Prod \
  --profile sci-iot-profile

# Get fleet metrics
aws iot describe-thing-group \
  --thing-group-name SCI-Property-Fleet-Prod \
  --profile sci-iot-profile
```

### Query Real-time IoT Data
```bash
# Query recent environmental data from Timestream
aws timestream-query query \
  --query-string "SELECT property_id, AVG(temperature) as avg_temp, AVG(humidity) as avg_humidity FROM SCI_Properties.EnvironmentalData WHERE time between ago(1h) and now() GROUP BY property_id" \
  --profile sci-iot-profile

# Get security events from last 24 hours
aws timestream-query query \
  --query-string "SELECT * FROM SCI_Properties.SecurityEvents WHERE time > ago(24h) ORDER BY time DESC" \
  --profile sci-iot-profile
```

### Manage Device Certificates and Policies
```bash
# List active certificates
aws iot list-certificates --ascending-order false --profile sci-iot-profile

# Update device policy
aws iot replace-policy \
  --policy-name SCI-IoT-Device-Policy \
  --policy-document file://updated-device-policy.json \
  --profile sci-iot-profile
```

### Monitor Job Execution
```bash
# Check OTA job status
aws iot describe-job --job-id SCI-Firmware-Update-v2.1.0 --profile sci-iot-profile

# List job executions
aws iot list-job-executions-for-job \
  --job-id SCI-Firmware-Update-v2.1.0 \
  --profile sci-iot-profile
```

### Device Shadow Operations
```bash
# Get device shadow
aws iot-data get-thing-shadow \
  --thing-name sci-property-001-environmental \
  --profile sci-iot-profile \
  shadow-output.json

# Update device shadow
aws iot-data update-thing-shadow \
  --thing-name sci-property-001-environmental \
  --payload '{"state":{"desired":{"reporting_interval":300}}}' \
  --profile sci-iot-profile \
  update-result.json
```

## Step 10: Log out of IAM Identity Center

When you are done using your IAM Identity Center profile, run the following command to delete your cached credentials.

```bash
aws sso logout
```

Successfully signed out of all SSO profiles.

## Step 11: Clean up resources

After you're done with this tutorial, clean up any resources you created during this tutorial that you no longer need, including:

### Delete IoT Core Resources
```bash
# Delete provisioning template
aws iot delete-provisioning-template --template-name SCI-Property-Device-Template

# Delete topic rules
aws iot delete-topic-rule --rule-name SCI_Environmental_Data_Rule
aws iot delete-topic-rule --rule-name SCI_Security_Alerts_Rule

# Delete thing groups
aws iot delete-thing-group --thing-group-name SCI-Property-Fleet-Prod
aws iot delete-thing-group --thing-group-name SCI-Property-Fleet-Dev

# Delete thing types
aws iot delete-thing-type --thing-type-name SCI-Environmental-Sensor
aws iot delete-thing-type --thing-type-name SCI-Security-Camera
aws iot delete-thing-type --thing-type-name SCI-Smart-Lock

# Delete policies
aws iot delete-policy --policy-name SCI-IoT-Device-Policy
aws iot delete-policy --policy-name SCI-Fleet-Provisioning-Policy
```

### Delete Analytics Resources
```bash
# Delete Kinesis Analytics application
aws kinesisanalytics delete-application --application-name SCI-Property-Analytics

# Delete Kinesis streams
aws kinesis delete-stream --stream-name SCI-IoT-RealTime-Stream
aws kinesis delete-stream --stream-name SCI-Analytics-Output-Stream

# Delete Timestream tables and database
aws timestream-write delete-table --database-name SCI_Properties --table-name EnvironmentalData
aws timestream-write delete-table --database-name SCI_Properties --table-name SecurityEvents
aws timestream-write delete-database --database-name SCI_Properties
```

### Delete S3 buckets
```bash
aws s3 rb s3://sci-iot-data-lake-prod --force
aws s3 rb s3://sci-iot-firmware-updates --force
aws s3 rb s3://sci-property-documents-prod --force
```

## Troubleshooting

### Common SCI IoT-specific issues

**Permission denied for IoT Core resources**
- Ensure you're using the correct permission set (e.g., SCI-IoT-Engineers-Prod for production)
- Verify IoT policies are correctly attached to certificates
- Check thing group permissions and fleet provisioning roles

**Device connectivity issues**
- Verify device certificates are active and not revoked
- Check IoT Core endpoint configuration
- Validate MQTT topic permissions in device policies

**Timestream query failures**
- Ensure proper IAM permissions for Timestream access
- Verify database and table names in queries
- Check data retention policies

**OTA job failures**
- Validate S3 bucket permissions for firmware files
- Check job document syntax and target selection
- Verify device capability to receive and process jobsess to the SCI AWS account
- Verify the region matches your SCI deployment region (typically eu-west-1 or eu-central-1)

**S3 bucket access issues**
- SCI buckets follow naming convention: `sci-{resource-type}-{environment}`
- Ensure your permission set includes S3 access for SCI buckets

**RDS connection problems**
- SCI databases use PostgreSQL engine
- Connection requires SSL: `--ssl-mode require`
- Use the correct database identifier: `sci-{service}-{environment}`

**IoT policy errors**
- Ensure your permission set includes IoT permissions
- Check the policy document in `docs/iot-sensors-policy.json`

**AWS CLI installation issues**
- `ModuleNotFoundError: No module named '_struct'`: Reinstall AWS CLI v2
  ```bash
  # Windows: Use MSI installer
  msiexec /i AWSCLIV2.msi /quiet
  
  # Linux: Use curl method
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  sudo ./aws/install
  
  # Verify installation
  aws --version
  ```

**SSO Token errors**
- `Error loading SSO Token: Token for [profile] does not exist`:
  ```bash
  # First login to create token
  aws sso login --profile solia-admin
  
  # Then verify credentials
  aws sts get-caller-identity --profile solia-admin
  ```

**SSO Server errors**
- `Ce n'est pas vous, mais nous. Nous n'avons pas pu finaliser votre demande`:
  ```bash
  # Wait 5-10 minutes and retry
  aws sso login --profile solia-admin
  
  # Alternative: Use device code method
  aws sso login --profile solia-admin --use-device-code
  
  # Clear SSO cache if persistent
  aws sso logout
  rm -rf ~/.aws/sso/cache/
  aws sso login --profile solia-admin
  ```

### Additional troubleshooting
- Check AWS CloudTrail logs for access attempts
- Verify your SSO session hasn't expired (sessions typically last 8 hours)
- Ensure your local AWS CLI version supports SSO (version 2.x required)

## Additional resources

- [AWS IAM Identity Center User Guide](https://docs.aws.amazon.com/singlesignon/)
- [SCI Soliai Invest IAM Best Practices](docs/AWS_IAM_BEST_PRACTICES.md)
- [AWS CLI Configuration and Credential Files](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
- [SCI Soliai Invest Security Documentation](docs/SECURITY.md)
