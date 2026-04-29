#!/bin/bash
# Pulls the latest admin-dashboard-template image from ECR, refreshes the
# runtime .env from S3, and restarts the container via docker compose.
# Intended to be invoked on the EC2 host by AWS SSM `send-command`.
#
# Usage: ./deploy-admin-dashboard.sh [staging|prod]
#
# Prereqs (one-time EC2 setup):
#   - docker + docker compose plugin installed
#   - IAM role on the instance with read access to ECR + the env S3 bucket
#   - /home/ec2-user/admin-dashboard/docker-compose.yml in place
#   - This script placed at /home/ec2-user/deploy-admin-dashboard.sh (chmod +x)
#   - ENV vars below adjusted for the actual ECR account and S3 paths

set -euo pipefail

ENV_NAME="${1:-staging}"
REGION="${AWS_REGION:-ap-northeast-2}"

# TODO: replace <ACCOUNT_ID> with the AWS account that owns the ECR repo
ECR_REGISTRY="<ACCOUNT_ID>.dkr.ecr.${REGION}.amazonaws.com"
ECR_REPO="${ECR_REGISTRY}/admin-dashboard-template"

case "$ENV_NAME" in
  prod)
    TAG="prod"
    S3_ENV_URI="s3://pardocs/admin-dashboard.env"
    ;;
  staging)
    TAG="staging"
    S3_ENV_URI="s3://pardocs-staging/staging.admin-dashboard.env"
    ;;
  *)
    echo "Usage: $0 [staging|prod]" >&2
    exit 1
    ;;
esac

APP_DIR="/home/ec2-user/admin-dashboard"
cd "$APP_DIR"

echo "==> Refreshing runtime env from $S3_ENV_URI"
aws s3 cp "$S3_ENV_URI" "$APP_DIR/.env"

echo "==> Logging in to ECR ($ECR_REGISTRY)"
aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"

export IMAGE="${ECR_REPO}:${TAG}"

echo "==> Pulling $IMAGE"
docker compose pull

echo "==> Restarting container"
docker compose up -d --remove-orphans

echo "==> Cleaning up dangling images"
docker image prune -f

echo "==> Deploy ($ENV_NAME) complete"
