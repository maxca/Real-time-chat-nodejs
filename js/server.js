// console.log('Work');
var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(8080).sockets;
	
	//console.log(client);
	// console.log(mongo);
	mongo.connect('mongodb://10.127.4.194',function(err,db){
		if(err) throw err;
		
		client.on('connection',function(socket){
			var col = db.collection('chat_max');
				sendStatus = function(s){
						socket.emit('status',s);
				};
			// Emait all message 
			//console.log(col.find().limit(100).sort({_id:1}));
			col.find().limit(100).sort({_id:1}).toArray(function(err,res) {
				if(err) throw err;
				socket.emit('output',res);
			});
			socket.on('input',function(data){
				var name = data.name,
				message = data.message,
				whitespacePattern = /^\s*$/;
				if(whitespacePattern.test(name) || whitespacePattern.test(message)){
					//console.log('Invalid.');
					sendStatus('Name and message is required.');
				}else{
					console.log(message);
					if(message == 'rem') {
						col.remove({},function(){
							client.emit('output',[data]);
								sendStatus({
								message : "Message Clear",
								clear	: true,
								option		: 'rm',
							});
						});
					}else{
						col.insert({name:name,message:message},function(){
						// emit last message to all clients 
						client.emit('output',[data]);					
						//console.log('Inserted');
							sendStatus({
								message : "Message sent",
								clear	: true,
								option	: 'insert',
							});
						});
					}
					
				}
			});
		});
	});
// client.on('connection',function(socket) {
	// console.log('Client has connection now');
// });
	