Oculus-Arduino w/ @sheva29
-----------

Assignment for MFA D+T Spring '14 Dynamic Interfaces class: make something magical using Node.js.
Oculus-Arduino is a virtual world that is controlled with physical movements.

You will need an Sparkfun Fio V3, a Wifly module, a MMA7361 accelerometer and a LiPo battery to recreate this experience, or find suitable alternatives of course.

To run the application, cd into the directory, let npm install modules, run node server.js in terminal and navigate to localhost:9000.
The progam uses Oculus Bridge to establish communication between the Oculus headtracking and the web browser.
You can download the oculus bridge from here: https://github.com/Instrument/oculus-bridge.

We used @samsniderheld's Oculus-Rift-Three.js-Boilerplate for this assignment: 
https://github.com/samsniderheld/Oculus-Rift-Three.js-Boilerplate
