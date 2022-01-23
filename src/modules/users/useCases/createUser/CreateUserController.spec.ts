import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection

describe("Create user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const data = {
      name: "Test",
      email: "test@test.com",
      password: "12345",
    };

    const response = await request(app).post("/api/v1/users").send(data);

    expect(response.status).toBe(201);
  });
});