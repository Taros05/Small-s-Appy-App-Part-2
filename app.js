/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// Code based off the Google Quickstart code, only the heartRate variables, appData, statistics, 
//and resetStats functions are mine

// [START gae_node_request_example]
const express = require('express');

const app = express();

let heartRate = [];
let minHeartRate = 0;
let maxHeartRate = 0;
let meanHeartRate = 0;
let medianHeartRate = 0;


app.get('/', (req, res) => {
  res
    .status(200)
    .send('Its the LubDub!')
    .end();
});

// A callback function to recieve and recalculate our statistics
app.get('/addData', (req, res) => {

    //Find if its our first value, if not see if its lower then our current minimum
    if(minHeartRate == 0){
      minHeartRate = req.query.heartRate
    }
    else if(req.query.heartRate < minHeartRate){
      minHeartRate = req.query.heartRate
    }

    // Find if its our current maximum
    if (req.query.heartRate > maxHeartRate){
      maxHeartRate = req.query.heartRate
    }

    // Push the new value into our array and then sort it for our next two statistics
    heartRate.push(req.query.heartRate)
    heartRate.sort()

    //A variable to keep the total
    var heartRateTotal = 0

    //Iterate and add up our hreatrates
    for(var index = 0; index < heartRate.length; index++){
      heartRateTotal += Number(heartRate[index])
    }

    //Divide our total by the length of the array
    meanHeartRate = heartRateTotal / heartRate.length
    
    //Find out if our array is odd or even in length, then find the median appropriately
    if(heartRate.length / 2){
      medianHeartRate = heartRate[heartRate.length / 2]
    }
    else{
      medianHeartRate = (Number(heartRate[Math.floor(heartRate.length/2)]) + Number(heartRate[Math.floor(heartRate.length/2)+1])) / 2
    }
    
    //Return our response
    res
      .status(200)
      .send('Heart rate updated!  Your heart rate was: ' + req.query.heartRate)
      .end();
});

// A callback function to display statistics
app.get('/statistics', (req, res) => {
  res
    .status(200)
    .send('Your statisics are: Minimum: ' + minHeartRate + ' Maximum: ' + maxHeartRate + 
    ' Mean: ' + Math.round(meanHeartRate) +' Median: ' + Math.round(medianHeartRate))
    .end();
});

// A callback function to wipe the array and variables and start fresh
app.get('/resetStats', (req, res) => {
  heartRate = [];
  minHeartRate = 0;
  maxHeartRate = 0;
  meanHeartRate = 0;
  medianHeartRate = 0;
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
