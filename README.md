# Congressional Effectiveness
How effective is Congress?

## Setup
### Clone the repository
```sh
git clone https://github.com/abhisuri97/congressional-effectiveness
cd congressional-effectiveness
```

### Install Homebrew
```sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### Install Node.js
```sh
brew install node
```

### Install MongoDB
```sh
brew install mongodb
mkdir -p /data/db
sudo chown -R `id -un` /data/db
```

### Install the packages
```sh
npm install
```

## Running the application

TODO: Set up  streamlined pg instance creation

`node scripts/init.js`

### Starting the server
Starting the MongoDB database:
```sh
mongod
```
In a separate terminal tab:
```sh
node backend/server.js
```
