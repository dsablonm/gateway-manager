import chai from 'chai';
import chaiHttp from 'chai-http'; 
import gatewayRouter from '../routes/gateway.js';
import Gateway from '../models/gateway.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Gateway Manager API', () => {
 /* before(() => {
    // Clear the database before each test
    return Gateway.deleteMany({});
  });*/

  describe('POST /api/gateway', () => {
    it('should create a new gateway', () => {
      return chai.request(gatewayRouter)
        .post('/api/gateway')
        .send({
          serial: '123456',
          name: 'Gateway 1',
          ip: '192.168.1.1'
        })
        .then(res => {
          console.log(res);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('serial', '123456');
          expect(res.body).to.have.property('name', 'Gateway 1');
          expect(res.body).to.have.property('ip', '192.168.1.1');
          expect(res.body).to.have.property('devices').that.is.an('array').with.lengthOf(0);
        });
    });
  });

  describe('GET /api/gateway/:serial', () => {
    it('should get details for a single gateway', () => {
      return chai.request(gatewayRouter)
        .get('/api/gateway/123456')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('serial', '123456');
          expect(res.body).to.have.property('name', 'Gateway 1');
          expect(res.body).to.have.property('ip', '192.168.1.1');
          expect(res.body).to.have.property('devices').that.is.an('array').with.lengthOf(0);
        });
    });

    it('should return a 404 if the gateway does not exist', () => {
      return chai.request(gatewayRouter)
        .get('/api/gateway/12345')
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Gateway not found');
        });
    });
  });

  describe('PATCH /api/gateway/:serial', () => {
    it('should update a gateway', () => {
      return chai.request(gatewayRouter)
        .patch('/api/gateway/123456')
        .send({
          name: 'Gateway 1 Updated'
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('serial', '123456');
          expect(res.body).to.have.property('name', 'Gateway 1 Updated');
          expect(res.body).to.have.property('ip', '192.168.1.1');
          expect(res.body).to.have.property('devices').that.is.an('array').with.lengthOf(0);
        });
    });

    it('should return a 404 if the gateway does not exist', () => {
      return chai.request(gatewayRouter)
        .patch('/api/gateway/123')
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Gateway not found');
        });
    });
  });

  describe('POST /api/gateway/:serial/device', () => {
	  it('should add a device to a gateway', () => {
		return chai.request(gatewayRouter)
		  .post('/api/gateway/123456/device')
		  .send({
			uid: 5,
			vendor: 'ACME',
			created: '2022-01-01',
			status: 'online'
		  })
		  .then(res => {
			expect(res).to.have.status(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.property('uid', 5);
			expect(res.body).to.have.property('vendor', 'ACME');
			expect(res.body).to.have.property('created', '2022-01-01');
			expect(res.body).to.have.property('status', 'online');
		  });
	  });

	  it('should return a 404 if the gateway does not exist', () => {
		return chai.request(gatewayRouter)
		  .post('/api/gateways/12345/device')
		  .send({
			uid: 5,
			vendor: 'ACME',
			created: '2022-01-01',
			status: 'online'			
		  })
		  .then(res => {
			  expect(res).to.have.status(404);
			  expect(res.body).to.be.an('object');
			  expect(res.body).to.have.property('message', 'Gateway not found');
			});			
    });	
  });		

  describe('DELETE /api/gateway/:serial/device/uid', () => {
    it('should delete a device from a gateway', () => {
      return chai.request(gatewayRouter)
        .delete('/api/gateway/123456/device/1')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('uid', '1');
          expect(res.body).to.have.property('vendor', 'ACME');
          expect(res.body).to.have.property('created', '2022-01-01');
          expect(res.body).to.have.property('status', 'online');
        });
    });

    it('should return a 404 if the gateway does not exist', () => {
      return chai.request(gatewayRouter)
        .delete('/api/gateway/123/device/1')
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Gateway not found');
        });
    });

    it('should return a 404 if the device does not exist or does not belong to the gateway', () => {
      return chai.request(gatewayRouter)
        .delete('/api/gateway/123/device/3')
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Device not found');
        });
    });

  });

  describe('DELETE /api/gateway/:serial', () => {
    it('should delete a gateway', () => {
      return chai.request(app)
        .delete('/api/gateway/123456')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('serial', '123456');
          expect(res.body).to.have.property('name', 'Gateway 1');
          expect(res.body).to.have.property('ip', '192.168.1.1');
          expect(res.body).to.have.property('devices').that.is.an('array').with.lengthOf(0);
        });
    });

    it('should return a 404 if the gateway does not exist', () => {
      return chai.request(app)
        .delete('/gateways/123')
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Gateway not found');
        });
    });
  });
});

