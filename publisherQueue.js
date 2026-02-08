const solace = require('solclientjs');

solace.SolclientFactory.init({
  profile: solace.SolclientFactoryProfiles.version10,
});

const session = solace.SolclientFactory.createSession({
  url: 'ws://localhost:8008',
  vpnName: 'default',
  userName: 'admin',
  password: 'admin',
});

session.on(solace.SessionEventCode.UP_NOTICE, () => {
  console.log('Connected to local Solace');

  const msg = solace.SolclientFactory.createMessage();
  
  // CHANGE: Send to Queue instead of Topic
  msg.setDestination(
    solace.SolclientFactory.createDurableQueueDestination('demo-queue')
  );
  
  msg.setBinaryAttachment('Hello from Docker Solace - Queue!');
  msg.setDeliveryMode(solace.MessageDeliveryModeType.PERSISTENT); // CHANGE: Persistent
  
  session.send(msg);
  console.log('Message sent to queue');
});

session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, () => {
  console.error('Connection failed');
  process.exit(1);
});

session.connect();