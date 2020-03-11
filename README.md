# LambdaHelpers
### Helpers of instances from AWS

Steps:
- Create a lambda function
  - Paste the code in editor
  - If lambda function is to change type of instance, set timeout 60 seconds
- Create test of the lambda function
  - Set JSON to test and save (view in bottom of this page)
- Go to IAM service and create an policy
  - Set permissions in the policy:
    - DescribeInstanceAttribute
    - DescribeInstances
    - ModifyInstanceAttribute
    - StartInstances
    - StopInstances
  - Define the functions that will use the policy
    - Find the lambda function and set
  - Open CloudWatch service
    - Schedule the interval to execute a lambda function in Rules
    
    
## Test of ToogleInstanceState:
  ```
    // JSON to send test (OFF)
    {
        "typeRequest": "toggleOff",
        "instanceRegion": "sa-east-1",
        "instanceId": [
            "i-04c125a3da9312fe0"
        ]
    }

    // JSON to send test (ON)
    {
        "typeRequest": "toggleOn",
        "instanceRegion": "sa-east-1",
        "instanceId": [
            "i-04c125a3da9312fe0"
        ]
    }
  ```
  
## Test of ToggleInstanceType:

    // JSON to send test
    {
        "requestType": "toggleInstanceType",
        "instanceRegion": "sa-east-1",
        "instanceId": [
            {
            "typeDefault": "t2.medium",
            "id": "i-04c125a3da9312fe0"
            }
        ]
    }

