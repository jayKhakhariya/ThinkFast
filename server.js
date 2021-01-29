const express = require('express')();
const dumbQuestions = { "questions" : [{"Question":"How many main characters are there in comedy-sitcom Friends?", "Answer":"6", "points":1000}, {"Question":"What is Ross's daughter name in Friends?", "Answer":"Emma","points":1000},{"Question":"Who is the joker clown in Friends out of 6 characters?", "Answer":"Joey","points":1000},{"Question":"Is Rachel in Friends?", "Answer":"Yes","points":1000},{"Question":"Do you think Jay has watched House of Cards?", "Answer":"Yes","points":1000},{"Question":"Who did Phoebe marry in the last season of Friends?", "Answer":"Mike","points":1000},{"Question":"Is jay interested in Distributed Computing and did he like Rob?", "Answer":"Hell,yeah","points":1000},{"Question":"Rachel's real name?", "Answer":"Jennifer","points":1000},{"Question":"Jay's favourite character in Friends?", "Answer":"Joey","points":1000},{"Question":"Character i don't like in Friends? <br>hint: it's a girl, makes noise when she laughs", "Answer":"Janice","points":1000}]}
express.get("/", (req,res)=> res.sendFile(__dirname + "/index.html"))
const http = require('http');
const httpServer = http.createServer(express);

var myServer = require('ws').Server;

var socket = new myServer({"server": httpServer});

httpServer.listen(1234, function() {
    console.log(`Server is listening on port 1234`)
});

// form a timestamp priority queue!!
class Node {
    constructor(event,next) {
      this.event = event;
      this.next = next;
    }
}
class PriorityQueue { 
  
    // A linkedlist is used to implement priorityQueue 
    constructor() 
    { 
        this.top = null; 
    } 
    enqueue(event){
        let curr = this.top;
        let prev = null;
        while(curr!=null && curr.event.timestamp < event.timestamp){
            prev = curr
            curr = curr.next;
        }
        let newNode = new Node(event,curr);
        if(prev==null){
            this.top = newNode;
        }
        else if(curr==null){
            prev.next = newNode;
        }
        else{
            prev.next = newNode;
        }
    }
    dequeue(){
        var result = this.top.event;
        this.top = this.top.next
        return result;
    }

    isEmpty(){
        return this.top == null;
    }
} 

queue = new PriorityQueue();

socket.on('connection', function(ws){
    console.log("New client connected:");

    ws.on("message", function(message){
        console.log("Received: "+message);

        var myMessage = JSON.parse(message);
        myMessage["ws"] = ws;
        queue.enqueue(myMessage);   
    
        if(myMessage.type == "check"){
            setTimeout(() => {
                while(!queue.isEmpty()){
                    var temp = queue.dequeue();
                    handleEvent(temp,temp.ws);
                }
            }, 5000);
        }
        else{
            while(!queue.isEmpty()){
                handleEvent(queue.dequeue(),ws);
            }
        }    
    });  

    ws.on('close',function(){
        console.log("client has disconnected");
    });
});


function handleEvent(myMessage,ws){
    if(myMessage.type == "name"){
        ws.personName = myMessage.data;
        socket.clients.forEach(function sendNewClient(client){
            // not sending the same message to the person who sent the message itself
            if(client != ws){
                client.send(JSON.stringify({
                    type: "newClient",
                    name: ws.personName
                }));
            }
        });
    }
    else if(myMessage.type == "message"){
        socket.clients.forEach(function sendChat(client){
            // not sending the same message to the person who sent the message itself
            if(client != ws){
                client.send(JSON.stringify({
                    type: "message",
                    name: ws.personName,
                    data: myMessage.data
                }));
            }
        });
    }
    else if(myMessage.type == "check"){
        // do some processing and check the answer and reply json object with yes or no
        // also form an event queue which actually checks the time stamp and puts the event into the queue and then it assigns or checks who answered first
        // ask the client to display the work if the answer was correct! and also send your name.

        var isCorrect = (myMessage.data == dumbQuestions.questions[myMessage.current].Answer);
        
        socket.clients.forEach(function sendResponse(client){
            // not sending the same message to the person who sent the message itself
            if(client != ws){
                client.send(JSON.stringify({
                    type: "reply",
                    name: ws.personName,
                    current: myMessage.current,
                    response: isCorrect
                }));
                
            }
            else{
                client.send(JSON.stringify({
                    type: "reply",
                    response: isCorrect,
                    point: dumbQuestions.questions[myMessage.current].points
                }));
            }
        });
        dumbQuestions.questions[myMessage.current].points-= 50;
    }
    else if(myMessage.type == "next"){
        // send the next question object in form of json
        // also send a notification to the other client that you have moved on to the next question
        if(myMessage.current > 9){
            ws.send(JSON.stringify({
                type: "end"
            }));
        }
        else{
            ws.send(JSON.stringify({
                type: "next",
                data: dumbQuestions.questions[myMessage.current].Question,
                name: ws.personName
            }));
        }
    }
    else if(myMessage.type == "typingMessage"){
        socket.clients.forEach(function sendNewClient(client){
            // not sending the same message to the person who sent the message itself
            if(client != ws){

                client.send(JSON.stringify({
                    type: "typingMessage",
                    name: ws.personName,
                    isTyping: myMessage.isTyping
                }));
            }
        });
    }
    else if(myMessage.type == "typingAnswer"){
        socket.clients.forEach(function sendNewClient(client){
            // not sending the same message to the person who sent the message itself
            if(client != ws){

                client.send(JSON.stringify({
                    type: "typingAnswer",
                    name: ws.personName,
                    isTyping: myMessage.isTyping
                }));
            }
        });
    }
}
