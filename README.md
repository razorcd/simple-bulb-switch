Bulb app
===========


Installing app : `npm install`


Start the app with `node app.js`


Load main bulb page:  `localhost:8080`

### Requests:

```
curl -X POST -H "Content-Type: application/json" -d '{"name":"abc","password":"xyz"}' localhost:8080/configs
```

```
curl -v -X GET localhost:8080/configs
```

```
curl -v -X GET localhost:8080/configs/abc
```

```
curl -v -X PUT -H "Content-Type: application/json" -d '{"name":"a2","password":"xyszzz"}' localhost:8080/configs/abc
```

```
curl -v -X DELETE -H "Content-Type: application/json" localhost:8080/configs/abc
```

```
http://localhost:8080/search?name=abcd&data.password=xyz
```