
# Installation

### 1. Clone project and install

```bash
$ yarn install
```

### 2. Set .env file

```
For dev in localhost, Copy the .env.template file and rename it
as .env to initialize your environment variables
```

### 3. Create and initialize the database with docker

```bash
$ docker compose up -d
```

# Migrations

### Create migration
```
$ npx mikro-orm migration:create -n name
```
### Load migration
```
$ npx mikro-orm migration:up
```