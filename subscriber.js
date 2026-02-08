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
  console.log('Connected');

  session.subscribe(
    solace.SolclientFactory.createTopicDestination('demo/hello'),
    true,
    'sub1',
    10000
  );
});

session.on(solace.SessionEventCode.MESSAGE, (msg) => {
  console.log('Received:', msg.getBinaryAttachment());
});

session.connect();
