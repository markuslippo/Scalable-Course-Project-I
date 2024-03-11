# To run the application:

Prequisites: 
    cd grader-api
    docker build -t grader-image .

    and

    cd programming-ui
    npm install

To run:
    development: docker compose up
    or 
    production: docker compose -f docker-compose.prod.yml up

    note, on my system it takes a few minutes to start up programming-api: wait for it's "listening on" log

To run tests:
    docker compose run --rm --entrypoint npx e2e-playwright playwright test

On the browser:
    http://localhost:7800