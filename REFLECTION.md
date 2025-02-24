# Description of the application
The application has the following components. 

1) A UI that allows the user to fetch programming assignments and write a solution with Python. The UI refreshes automatically and displays the current state of the application. 
The state of the application includes the current assignment, user uuid and the number of submission points displayed on the top bar. Upon writing a Python program and submitting their code,
the frontend sends a HTTP POST method to programming-api with their submission. If the submission requires grading, a Server Sent Events connection is opened with the programming-api. When the grading completes, the frontend receives a message from the backend and closes the SSE event displaying the results of the grading automatically. 

2) The programming-api receives HTTP requests to different endpoints. In a nutshell, the api serves assignments to the frontend and orchestrates the grading of submissions. The programming-api handles database transactions and has cached database results for faster database reads (particularly for assignments). The cache is flushed upon grading, as this updates the database. The programming-api serves assignments to the frontend with a traditional HTTP POST structure. The programming-api also handles the incoming submission from the frontend. If the submission is identical to one already graded, the solution is updated to the database and sent to the frontend. Otherwise the submission is initialized into the database before sending the submission to be graded. The programming-api sends the submissions as messages into a Redis stream to the grader-apis. The programming-api also handles the Server Sent Events connection to the frontend and once it has received the result from grader-apis, the api updates the database and sends the result to the frontend. I decided to have programming-api orchestrate the grading by "transmitting" messages through the grader-api and frontend, also saving the results to the database. This way the programming-api will throw an error if something is not saved in the database. Additionally, since a SSE connection is opened once it receives the submission from the frontend, the programming-api can ensure that a user only has one assignment = one SSE connection in grading at a time.

3) Two deployments of grader-api handle the actual grading of the Python code. The grader-apis read a Redis stream and read messages individually in a way that each message is only read by
one grader-api. Additionally, the number of deployments can be easily increased. Upon a message, the grader-api reads the message and grades it with a grader-image. The result is then sent back to the programming-api with a HTTP POST. 

4) Nginx configuration that manages web traffic. It defines three upstreams services and listens on port 7800, routing requests to different services. 



# Future improvements

    There are weird errors regarding websockets, which I have not used. Will need to figure out what is causing this as everything still works

    client.ts:634 WebSocket connection to 'ws://localhost:7800/' failed: 
    setupWebSocket @ client.ts:634
    Show 1 more frame
    Show less
    client.ts:634 Uncaught (in promise) DOMException: Failed to construct 'WebSocket': The URL 'ws://localhost:undefined/' is invalid.
    at setupWebSocket (http://localhost:7800/@vite/client:957:20)
    at fallback (http://localhost:7800/@vite/client:936:22)
    at WebSocket.<anonymous> (http://localhost:7800/@vite/client:972:13)
    proxy.js?v=36fac1db:15 [HMR][Svelte] Unrecoverable HMR error in <Header>: next update will trigger a full reload

    Improvements for performance:
    - Compressing sent contents. This was not developed as there was some uncertainty with SSE supported Nginx configurations
    - Comparing a hash of the code instead of comparing possibly long strings
    - Having the grader-api read the test_code from the database instead of sending it

    Improvements for other things:
    - Make the frontend styles and components more structured
    - Should include better input type checks for the programming-api and possibly refactor
    - Improve nginx configuration