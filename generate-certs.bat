@echo off
echo Génération des certificats SSL auto-signés...

cd nginx\certs

openssl req -x509 -nodes -days 365 -newkey rsa:2048 ^
  -keyout server.key ^
  -out server.crt ^
  -subj "/C=FR/ST=IDF/L=Paris/O=SCI Solia Invest/CN=localhost"

echo Certificats générés dans nginx/certs/
echo - server.key (clé privée)
echo - server.crt (certificat)

cd ..\..