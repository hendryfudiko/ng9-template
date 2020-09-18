result=$(
  curl \
    https://jsonplaceholder.typicode.com/todos/1 \
    | jq .id)
echo ${result}
