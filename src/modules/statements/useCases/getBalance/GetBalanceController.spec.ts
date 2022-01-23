import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe("Get balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get user balance", async () => {
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

    const response = await request(app).get("/api/v1/statements/balance").set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
    expect(response.body.balance).toBe(0);
  })
})