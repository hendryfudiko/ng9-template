#!/bin/bash

scriptName=${1}
pids=()
result=0

list_scripts=($(cat package.json \
  | jq '.scripts' \
  | jq 'keys' \
  | jq --arg query "$scriptName" 'map(select(. | contains($query)))' \
  | jq '.[] | tostring' \
  | sed 's/[",]//g'))

for i in "${list_scripts[@]}"; do
  echo "Found script $i, executing..."
  yarn run "$i" &
  pids+=(${!})
done

for pid in ${pids[@]}; do
  wait ${pid};
  local status=${?}
  result=$(( ${result} + ${status} ))
done

if [[ ${result} -gt 0 ]]; then
  echo "${result} process failed when executing '${scriptName}'"
  exit 1
fi

echo "HELLO BROO"
