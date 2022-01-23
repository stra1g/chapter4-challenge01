import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe("Get Statement Operation", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get statement operation", async () => {
    const data = {
      name: "Test",
      email: "test@test.com",
      password: "12345",
    };

    await request(app).post("/api/v1/users").send(data);

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: data.email,
      password: data.password,
    });

    const { token } = responseToken.body;

    const statementResponse = await request(app).post("/api/v1/statements/deposit").send({
      amount: 500,
      description: "Test amount"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const { id } = statementResponse.body;

    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(id);
    expect(response.body).toHaveProperty("amount");
  });
});