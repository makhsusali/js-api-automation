const pactum = require('pactum');


const report = require("../report/report.json");

const client_id = process.env.XRAY_CLIENT_ID;
const client_secret = process.env.XRAY_CLIENT_SECRET;


it('Get the token and upload the report', async () => {

    console.log("Uploading test execution to JIRA.. Please wait......");

    const response = await pactum.spec()
      .post('https://xray.cloud.getxray.app/api/v1/authenticate')
      .withHeaders({
            'Content-Type': 'application/json'
            })
      .withBody(`{"client_id": "${client_id}", "client_secret": "${client_secret}"}`)
      .expectStatus(200);
    const token = response.body;
    console.log("Few more seconds....");
    await pactum.spec()
      .post(`https://xray.cloud.getxray.app/api/v1/import/execution/cucumber`)
      .withHeaders('Authorization', `Bearer ${token}`)
      .withHeaders({
        'Content-Type': 'application/json'
        })
      .withBody(JSON.stringify(report));
      console.log("Done!\nUpload successfull.");
});