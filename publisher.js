const solace = require('solace');

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
  msg.setDestination(
    solace.SolclientFactory.createTopicDestination('demo/hello')
  );
  msg.setBinaryAttachment('Hello from Docker Solace!');
  msg.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);

  session.send(msg);
  console.log('Message sent');
});

session.connect();
