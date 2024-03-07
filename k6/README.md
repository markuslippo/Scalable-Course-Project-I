# This folder should contain the k6 tests for the application


Fetching an assignment
______________________



          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: assignment-page-performance-test.js
     output: -

  scenarios: (100.00%) 1 scenario, 10 max VUs, 39s max duration (incl. graceful stop):
           * default: Up to 10 looping VUs for 9s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)


     data_received..................: 1.6 MB 170 kB/s
     data_sent......................: 5.6 kB 585 B/s
     http_req_blocked...............: avg=557.81µs min=0s      med=505.29µs max=5.94ms   p(90)=1.3ms    p(95)=1.88ms
     http_req_connecting............: avg=385.01µs min=0s      med=0s       max=2.11ms   p(90)=1.21ms   p(95)=1.33ms
     http_req_duration..............: avg=64.18ms  min=44.74ms med=56.11ms  max=116.24ms p(90)=87.09ms  p(95)=96.83ms
       { expected_response:true }...: avg=64.18ms  min=44.74ms med=56.11ms  max=116.24ms p(90)=87.09ms  p(95)=96.83ms
     http_req_failed................: 0.00%  ✓ 0        ✗ 70
     http_req_receiving.............: avg=169.95µs min=0s      med=0s       max=2.16ms   p(90)=537.87µs p(95)=910.84µs
     http_req_sending...............: avg=112.18µs min=0s      med=0s       max=1.95ms   p(90)=506.13µs p(95)=525.09µs
     http_req_tls_handshaking.......: avg=0s       min=0s      med=0s       max=0s       p(90)=0s       p(95)=0s
     http_req_waiting...............: avg=63.9ms   min=44.74ms med=56.11ms  max=115.72ms p(90)=87.05ms  p(95)=96.54ms
     http_reqs......................: 70     7.316566/s
     iteration_duration.............: avg=1.07s    min=1.05s   med=1.06s    max=1.12s    p(90)=1.09s    p(95)=1.1s
     iterations.....................: 70     7.316566/s
     vus............................: 3      min=3      max=10
     vus_max........................: 10     min=10     max=10


running (09.6s), 00/10 VUs, 70 complete and 0 interrupted iterations
default ✓ [======================================] 00/10 VUs  9s







Submitting an assignment
________________________
PS C:\Users\Markus\Koulu\Project1\k6> k6 run submitting-performance-test.js

          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: submitting-performance-test.js
     output: -

  scenarios: (100.00%) 1 scenario, 1 max VUs, 10m30s max duration (incl. graceful stop):
           * ui: 5 iterations shared among 1 VUs (maxDuration: 10m0s, gracefulStop: 30s)


     browser_data_received.......: 1.6 MB 91 kB/s
     browser_data_sent...........: 60 kB  3.5 kB/s
     browser_http_req_duration...: avg=31.73ms  min=2.35ms   med=17.12ms  max=180.1ms  p(90)=77.55ms  p(95)=89.66ms
     browser_http_req_failed.....: 0.00%  ✓ 0        ✗ 140
     browser_web_vital_cls.......: avg=0.045035 min=0        med=0.075059 max=0.075059 p(90)=0.075059 p(95)=0.075059
     browser_web_vital_fcp.......: avg=317.66ms min=222.3ms  med=288.19ms max=489.69ms p(90)=432.86ms p(95)=461.27ms
     browser_web_vital_fid.......: avg=239.99µs min=199.99µs med=199.99µs max=300µs    p(90)=299.99µs p(95)=300µs
     browser_web_vital_inp.......: avg=16ms     min=16ms     med=16ms     max=16ms     p(90)=16ms     p(95)=16ms
     browser_web_vital_lcp.......: avg=325.07ms min=237ms    med=288.19ms max=503.8ms  p(90)=444.63ms p(95)=474.22ms
     browser_web_vital_ttfb......: avg=95.36ms  min=49.7ms   med=75.1ms   max=164.6ms  p(90)=152.96ms p(95)=158.78ms
     data_received...............: 0 B    0 B/s
     data_sent...................: 0 B    0 B/s
     iteration_duration..........: avg=3.06s    min=2.72s    med=3.12s    max=3.31s    p(90)=3.29s    p(95)=3.3s
     iterations..................: 5      0.287503/s
     vus.........................: 1      min=1      max=1
     vus_max.....................: 1      min=1      max=1