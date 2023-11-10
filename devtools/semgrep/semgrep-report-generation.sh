#!/bin/bash
# This script is used to generate the semgrep report info for the semgrep-report.yaml file.

# Add index to sarif
jq 'reduce range(.|length) as $i(.;.[$i].index=($i+1))' "$latestsarif" > resultsafter.sarif
# Extract index, ruleId, severity, path, line, code
findings=$(jq '.[] | { index: .index, ruleId: .ruleId, suppression: .suppression, severity: .severity, path: .locations[0].physicalLocation.artifactLocation.uri, line: .locations[0].physicalLocation.region.endLine, code: .locations[0].physicalLocation.region.snippet.text }' resultsafter.sarif)
# Convert to array
findings=$(echo "$findings" | jq -s .)
echo "finding=$(echo $findings)" >> "$GITHUB_OUTPUT"
# Extract index, ruleId, uri, message
messages=$(jq '.[] | { index: .index, ruleId: .ruleId, uri: .uri, message: .description }' resultsafter.sarif)
# Convert to array
messages=$(echo "$messages" | jq -s .)
echo "message=$(echo $messages)" >> "$GITHUB_OUTPUT"
