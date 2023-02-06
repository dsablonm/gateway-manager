"# gateways-app"

This project is an example for managing gateways and their associated devices.

## Requirements

To run this project you will need to have installed:

-Node.js
-npm or yarn
-MongoDB

## Installation

1. Clone this repository to your computer.
2. Install the dependencies by running `npm install` or `yarn install` in the root folder of the project.
3. Start MongoDB on your computer.
4. Run `npm start` or `yarn start` to start the server.

## Use

The project runs on `http://localhost:4000` and has the following endpoints available:

### Gateways

- `GET /api/gateway`: Get a list of all gateways.
- `GET /api/gateway/:serial`: Get a specific gateway.
- `POST /api/gateway`: Create a new gateway.
- `PATCH /api/gateway/:serial`: Update an existing gateway.
- `DELETE /api/gateway/:serial`: Delete an existing gateway.
- `POST /api/gateway/:serial/device`: Create a new device associated with a gateway
- `DELETE /api/gateway/:serial/device/uid`: Delete a device from a gateway

## License

This project is licensed under the [ISC](https://opensource.org/licenses/ISC) license.
