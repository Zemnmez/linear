#!/bin/bash
aws cloudfront create-invalidation --cli-input-json "$(jq -s '.[0].DistributionList.Items[] | select(.Aliases.Items[] | . == "zemn.me") | {
    DistributionId: .Id,
    InvalidationBatch: {
      Paths: $files | split("\n") | {Quantity: . | length, Items: [.[] | .[1:]]},
      CallerReference: $ref | split(" ") | join("_")
    },
  }' <(aws cloudfront list-distributions) \
    --arg files "$(cd public;find . -type f)" \
    --arg ref "cli-invalidation-$(date -R)")"
