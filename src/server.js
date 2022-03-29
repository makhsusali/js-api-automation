const { mock, handler } = require('pactum');
const { string } = require('yup');
const userData = require('./data/maps/user.json')
const { like } = require('pactum-matchers');


handler.addInteractionHandler('get user', (ctx) => {
  return {
    request: {
      method: 'GET',
      path: '/api/employee',
      queryParams: {
        id: ctx.data.id,
        firstName: ctx.data.firstName
      }
    },
    response: {
      status: 200,
      body:  ctx.data
    }
  }    
});

mock.addInteraction({
  request: {
    method: 'GET',
    path: '/api/all'
  },
  response: {
    status: 200,
    body:  userData
  }  
});

mock.addInteraction({
    request: {
      method: 'GET',
      path: '/api/employee/{id}',
      pathParams: {
        id: like('random-id')
      }
    },
    stores: {
      empId: 'req.pathParams.id'
    },
    response: {
      status: 200,
      body:  userData[0]
    }  
});

mock.addInteraction({
  request: {
    method: 'POST',
    path: '/api/employee/new',
    body: like({
      firstName:   "string",
      lastName:    "string",
      designation: "string",
    })
  },
  response: {
    status: 200,
    body: userData[0]
  }
});

for (let i = 0; i < userData.length; i++) {
    mock.addInteraction('get user', userData[i]);
}

mock.start(3000);