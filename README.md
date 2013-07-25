MarsAttack
==========

MarsAttack game, devcamp grenoble

Let's go and kill some martians !

## Prerequisites ##

Please be sure to have nodejs and jamjs (use for dependency management for webapp) installed:
*   nodejs http://nodejs.org/
*   jamjs http://jamjs.org/

After cloning the repo, cd to webapp/ and perform the jam install command on your webapp to install required deps.

## Local development ##

This section describes how to setup your local environment (to be improved).

You will need a local web server to be able to run the application locally. Here is the virtualhost conf we use with apache:

```
<VirtualHost *:80>
    <Directory "<YOUR ROOT>">
      Options Indexes FollowSymLinks
      AllowOverride None
      Order allow,deny
      Allow from all
    </Directory>
    DocumentRoot "<YOUR ROOT>"
    ServerName wwwdev

    ProxyPass /backend http://localhost:8080/backend
    ProxyPassReverse /backend http://localhost:8080/backend
</VirtualHost>
```
