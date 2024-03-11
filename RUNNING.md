# To run the application:

Prequisites: 
    cd grader-api
    docker build -t grader-image .

    and

    cd programming-ui
    npm install

To run:
docker compose up

To run tests:
docker compose run --rm --entrypoint npx e2e-playwright playwright test

On the browser:
http://localhost:7800