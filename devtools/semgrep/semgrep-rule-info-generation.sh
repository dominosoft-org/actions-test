#!/bin/bash
# This script is used to generate the semgrep rule info for the semgrep-report.yaml file.

sarif="$location.sarif"
# Extract the findings from the sarif file
cat $sarif | jq '.runs[] | .results' > results0.sarif
# Extract the details of the rules from the sarif file
cat $sarif | jq '.runs[] | .tool.driver.rules' > rules.sarif
# Extract the number of findings
resultlength=$(cat results0.sarif | jq '. | length')
if [ "$resultlength" -eq 0 ]; then
    echo "length=0" >> "$GITHUB_OUTPUT"
    echo "No findings were found."
    exit 0
fi
echo "length=$(echo $resultlength)" >> "$GITHUB_OUTPUT"
# Extract the rule ids
ruleIds=$(jq '.[] | .ruleId' results0.sarif)
# Convert the rule ids to an array
ruleList=(${ruleIds// / })
# The ignored findings
ignoredfindings=0
# Extract the severity, description and uri based on the rule id
for ((i=0; i<$resultlength; i++)); do
    fileName="results$i.sarif"
    fileNameNext="results$((i+1)).sarif"
    # Only the ignored findings will have a suppressions key
    if ! [ $(cat results0.sarif | jq '.['$i'] | .suppressions | length') -eq 0 ]; then
        ignoredType=$(cat results0.sarif | jq '.['$i'] | .suppressions[0].kind')
        ignoredfindings=$((ignoredfindings+1))
    else
        ignoredType='""'
    fi
    # Extract the severity, description and uri
    severity=$(cat rules.sarif | jq '.[] | select(.id == '"${ruleList[$i]}"') | .defaultConfiguration.level')
    description=$(cat rules.sarif | jq '.[] | select(.id == '"${ruleList[$i]}"') | '"$descriptionKey"'')
    uri=$(cat rules.sarif | jq '.[] | select(.id == '"${ruleList[$i]}"') | .helpUri')
    # Need to redirect the output to a new file as jq does not support in-place editing
    # Add the severity, description and uri to the new sarif file
    jq ' .['$i'] |= .+ { "severity" : '"$severity"', "description" : '"$description"', "uri" : '"$uri"', "suppression" : '"$ignoredType"' }' $fileName > $fileNameNext
done
# Calculate the number of findings that were not ignored
echo "reject=$(echo $((resultlength-ignoredfindings)))" >> "$GITHUB_OUTPUT"
# Output the latest sarif file name
echo "latestsarif=$(echo "results$resultlength.sarif")" >> "$GITHUB_OUTPUT"
