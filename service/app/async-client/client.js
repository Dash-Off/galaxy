import net from 'net';
class DashOffClient {
  constructor(host, port) {
    this.sock = undefined;
    this.host = host;
    this.port = port;
  }


  async connect() {
    try {
      this.sock = new net.Socket();
      return new Promise((resolve, reject) => {
        this.sock.connect(this.port, this.host, () => {
          console.log('Connected to the server');
          resolve();
        });
        this.sock.on('error', () => {
          console.log("!Cannot connect to client...");
          reject();
        });
      });
    } catch (e) {
      console.error("Cannot connect to client...")
    }
  }

  sendMessage = (message) => new Promise((resolve, reject) => {
    this.sock.write(message, 'utf-8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  receiveData = () => new Promise((resolve, reject) => {
    this.sock.on('data', (data) => {
      resolve(data.toString());
    });
    this.sock.on('error', reject);
  });


  disconnect() {
    try {
      this.sock.end()
      console.log("Closed connection")
    } catch (e) {}
  }
}

let handler = {
  get(target, name, receiver) {
    if (target[name]) {
      if (target[name] instanceof Function) {
        return function (...args) {
          return target[name].apply(this === receiver ? target : this, args);
        };
      }
    }
    function call(name) {
      return async function () {
        const args = arguments;
        const requestData = JSON.stringify({name, args, kwargs: {}})
        console.log("sending data");
        console.log(requestData);
        this.sendMessage(requestData);
        const responseData = await this.receiveData();
        console.log("responseData:")
        console.log(responseData)
        return JSON.parse(responseData);
        //return "Job sent"
      }
    }
    return call(name);
  }
}


export default function getClient(host, port) {
  const client = new DashOffClient(host, port);
  return new Proxy(client, handler);
}
