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
  console.log('Connected to Solace');

  // Create a flow to consume from queue
  const flow = session.createFlow({
    destination: solace.SolclientFactory.createDurableQueueDestination('demo-queue'),
    windowSize: 10
  });

  flow.on(solace.FlowEventCode.UP_NOTICE, () => {
    console.log('Flow bound to queue');
  });

  flow.on(solace.FlowEventCode.MESSAGE, (msg) => {
    console.log('Received from queue:', msg.getBinaryAttachment());
    // Acknowledge message for guaranteed delivery
    msg.acknowledge();
  });

  flow.connect();
});

session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, () => {
  console.error('Connection failed');
  process.exit(1);
});

session.connect();