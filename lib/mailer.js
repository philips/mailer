
var Hook = require('hook.io').Hook,
    util = require('util'),
    mailerModule = require('mailer');

var MailerHook = exports.MailerHook = function(options){

  //
  // Hook setup
  //
  
  for (var o in options) {
    this[o] = options[o];
  }
console.log('sanity');
  Hook.call(this);

  var self = this;
  self.debug = true;

  self.use('file', { file: './config.json'});

  self.on('ready', function(){
    
    self.on('i.sendEmail', function(event, email){
      
      self.send(email);
      
    });

  });

};

// Mailer inherits from Hook Hook
util.inherits(MailerHook, Hook);

MailerHook.prototype.send = function(options){

  var self = this,
      settings = self.get('mailer');

  mailerModule.send({
    ssl: true,
    to: options.to,
    from: options.from,
    host: settings.host,
    authentication: 'login',
    username: settings.username,
    password: settings.password,
    domain: settings.domain,
    subject: options.subject,
    body: options.body
  },
  function(err, result){
    if(err){ 
      return self.emit('o.error', err); 
    }
      
    self.emit('o.emailSent', result);
    
  });

};

