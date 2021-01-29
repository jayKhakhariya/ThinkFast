## Dependencies:

1. node and npm: this are needed to run the program, npm is used to install additional dependencies. This can be downloaded from their respective websites.
2. Express.js: To create an http server, use: npm install express
3. ws: web sockets for communication between client and server; npm install ws

## How to run

Once you have the dependencies installed run by the following command: node server.js

This will host the game server on the localhost on port 1234. Visit the address on any browser and start playing!

## Introduction

SillyQ is a distributed online multiplayer quiz game that you can play along with your friends as opponents or team but restricted within the local area network; if you want to play on two separate devices, it must be connected on the same network. Also, I have a chat system that you can use to do whatever you want to do.

The rules are pretty simple; you enter your name, and you start solving questions, and if anyone else gets connected to the server, you will be notified in the chat. And ifsomeone gets connected, you get updates from time to time of what other players are doing. Consider a two-player quiz game; the gist of the quiz questions or the project demonstrates that if someone solves(by pressing the ‘check’ button and it is correct) some question ‘X,’ first then, they receive more points than the other person.

## What Technologies have I used?

I have used basic front-end technologies like HTML, CSS, Vanilla JS (in the start) and to be consistent with the front-end, I am using node.js/express as back-end server for this project. The communication protocol between client and server is written using Web Sockets API.


## What Distributed Computing problems have I addressed?

I have tried to solve the main two distributed systems problems, how does synchronization work between more than two clients with message passing using the server as the main truth point. Another problem is timing the events according to some global clock or famously known as ‘happened before’ problem, i.e., event order based on the timestamp of some global clock. Both issues are fundamental in the design of a distributed system. 

Web Sockets API was also used in solving synchronization problem by throwing back and forth JSON objects from client to server and server to client.

For the second problem, I have used a priority queue to solve the problem, which is in increasing order of the received timestamp requests. To show what event came first, after
receiving an event, I am using setTimeOut to wait for a few seconds to see if any event is happening or has already happened relatively at the same time. If the event has happened then, it enqueues it in the priority list in the proper place and responds to both the requests accordingly. The request that came first was timestamped and therefore, will be executed first, and that player will be awarded relatively more points. Even though node js is a singlethreaded application, I am adding all the events to the queue before executing, thus maintaining event ordering.

In a nutshell, I have tried to demonstrate two main problems in the design of distributed systems; synchronizing the state and ordering events or ‘happened before.’
