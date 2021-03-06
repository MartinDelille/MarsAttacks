MarsAttacks
===========

MarsAttacks game, devcamp grenoble

Let's go and kill some martians !

## Prerequisites ##

Please be sure to have nodejs, jamjs (use for dependency management for webapp) and mongodb installed:
*   nodejs : http://nodejs.org/
*   jamjs : http://jamjs.org/
*   mongodb : http://www.mongodb.org/

After cloning the repo, perform the following command on your webapp to install required dependencies:

```
cd webapp
jam install
```

## Local development ##

This section describes how to setup your local environment (to be improved).

You will need a local web server to be able to run the application locally. Here is the virtualhost conf we use with apache:

```
<VirtualHost *:80>
    <Directory "/path/to/the/marsattacksfolder/webapp">
      Options Indexes FollowSymLinks
      AllowOverride None
      Order allow,deny
      Allow from all
    </Directory>
    DocumentRoot "<YOUR ROOT>"
    ServerName www.marsattacks.me
    ServerAlias marsattacks.me

    ProxyPass /backend http://localhost:8080/backend
    ProxyPassReverse /backend http://localhost:8080/backend
    ProxyPass /socket http://localhost:8080/socket
    ProxyPassReverse /socket http://localhost:8080/socket
</VirtualHost>
```

Make sure to point redirect the domain name to your local server in _/etc/hosts_:

```
127.0.0.1	www.marsattacks.me marsattacks.me
```

Start the server:

```
cd server
node server.js
```
