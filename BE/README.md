# JogjaKu

Jogjaku is web based travel application. In this app you can see list of travel destination and order event tickets.

---


## Postman API Documentation
[API Documentation Menyusul](https://guthib.com)

## Table of Contents

- [Jogjaku](#jogjaku)
  - [Table of Contents](#table-of-contents)
  - [User](#user)
    - [Register User](#register-user)
    - [Login User](#login-user)
  - [Admin](#admin)
    - [Login Admin](#login-admin)
    - [Create Event](#create-event)

---

## User

### Register User

Endpoint

```text
POST /register
```

Body

```json
{
    "username": "dimas",
    "fullName": "dimas pramantya",
    "email": "igkdimas@gmail.com",
    "password": "upn jogja",
    "phoneNumber": "081246402586"
}
```

Response

```json
{
    "message": "Sign Up Success!!!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiZGltYXMiLCJpYXQiOjE2ODk4NzcxNDIsImV4cCI6MTY4OTg4MDc0Mn0.fCekrY1tGMAUiUg4KK5xEULFjMGiOu1t5mrF-SyyQPo"
}
```

### Login User

Endpoint

```text
POST /login
```

Body

```json
{
    "email": "igkdimas@gmail.com",
    "password": "upn jogja"
}
```

Response

```json
{
    "message": "Login Success!!!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiZGltYXMiLCJpYXQiOjE2ODk4ODM3ODAsImV4cCI6MTY4OTg4NzM4MH0.nUAGXbuC3cM3illnVrr0C6YIa8httmOggVQ5YuogRZs"
}
```

---

## Admin

### Login Admin

Endpoint

```text
POST /admin/login
```

Body

```json
{
    "username": "AdMinSeCret",
    "password": "SeCretAdMin1*"
}
```

Response

```json
{
    "message": "Login Success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODk5NTI1NzAsImV4cCI6MTY4OTk1NjE3MH0.bCWHyJzJZrj4wQwAiGe26aIIIAgKu4ET00V6Bh5miPk"
}
```

### Create Event

Endpoint

```text
POST /admin/post-event
```

