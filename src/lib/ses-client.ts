import { SESClient } from "@aws-sdk/client-ses"

export interface AwsCredentials {
  accessKeyId: string
  secretAccessKey: string
  region: string
}

export function createSesClient(credentials: AwsCredentials): SESClient {
  return new SESClient({
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
  })
}

export const SES_REGIONS = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "af-south-1",
  "ap-south-1",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-northeast-3",
  "ap-southeast-1",
  "ap-southeast-2",
  "ca-central-1",
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-north-1",
  "eu-south-1",
  "il-central-1",
  "me-south-1",
  "sa-east-1",
] as const
