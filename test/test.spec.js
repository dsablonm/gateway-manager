import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';
import Gateway from '../models/gateway.js';

chai.use(chaiHttp);
const expect = chai.expect;

chai.use(chaiHttp);

describe('Gateway Manager API', () => {


  describe('POST /api/gateway', () => {
    it('should create a new gateway', () => {
      return chai.request(app)
        .post('/api/gateway')
        .send({
          serialNumber: '112233',
          name: 'Gateway 3',
          ipAddress: '192.168.1.3'
        })
        .then(res => {
          console.log(res);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('serialNumber', '112233');
          expect(res.body).to.have.property('name', 'Gateway 3');
          expect(res.body).to.have.property('ipAddress', '192.168.1.3');
          expect(res.body).to.have.property('devices').that.is.an('array').with.lengthOf(0);
        });
    });    

    it('should return a 400 if the gateway does not created', () => {
      return chai.request(app)
      .post('/api/gateway')
      .send({
        serialNumber: '112233',
        name: 'Gateway 3',
        ipAddress: '192.168'
        })
        .then(res => {
          expect(res).to.have.status(400);     
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Gateway validation failed: ipAddress: Invalid IPv4 address');
        });
    });

  });

  describe('GET /api/gateway/:serial', () => {
    it('should get details for a single gateway', () => {
      return chai.request(app)
        .get('/api/gateway/123456')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('serialNumber', '123456');
          expect(res.body).to.have.property('name', 'Gateway 1');
          expect(res.body).to.have.property('ipAddress', '192.168.1.1');
          expect(res.body).to.have.property('devices').that.is.an('array').with.lengthOf(2);
        });
    });

    it('should return a 404 if the gateway does not exist', () => {
      return chai.request(app)
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
      return chai.request(app)
        .patch('/api/gateway/112233')
        .send({
          name: 'Gateway 3 Updated'
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('serialNumber', '112233');
          expect(res.body).to.have.property('name', 'Gateway 3 Updated');
          expect(res.body).to.have.property('ipAddress', '192.168.1.3');
          expect(res.body).to.have.property('devices').that.is.an('array').with.lengthOf(0);
        });
    });

    it('should return a 404 if the gateway does not exist', () => {
      return chai.request(app)
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
		return chai.request(app)
		  .post('/api/gateway/123456/device')
		  .send({
			uid: 5,
			vendor: 'ACME',
			dateCreated: '2022-01-01',
			status: 'online'
		  })
		  .then(res => {
			expect(res).to.have.status(201);
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.property('uid', 5);
			expect(res.body).to.have.property('vendor', 'ACME');
			expect(res.body).to.have.property('dateCreated', '2022-01-01');
			expect(res.body).to.have.property('status', 'online');
		  });
	  });

	  it('should return a 404 if the gateway does not exist', () => {
		return chai.request(app)
		  .post('/api/gateway/123/device')
		  .send({
			uid: 5,
			vendor: 'ACME',
			dateCreated: '2022-01-01',
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
      return chai.request(app)
        .delete('/api/gateway/123456/device/5')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
        });
    });

    it('should return a 404 if the gateway does not exist', () => {
      return chai.request(app)
        .delete('/api/gateway/123/device/1')
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Gateway not found');
        });
    });

    it('should return a 404 if the device does not exist or does not belong to the gateway', () => {
      return chai.request(app)
        .delete('/api/gateway/112233/device/3')
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
        .delete('/api/gateway/112233')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('serialNumber', '112233');
          expect(res.body).to.have.property('name', 'Gateway 3 Updated');
          expect(res.body).to.have.property('ipAddress', '192.168.1.3');
          expect(res.body).to.have.property('devices').that.is.an('array').with.lengthOf(0);
        });
    });

    it('should return a 404 if the gateway does not exist', () => {
      return chai.request(app)
        .delete('/api/gateway/123')
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Gateway not found');
        });
    });
  });
});

