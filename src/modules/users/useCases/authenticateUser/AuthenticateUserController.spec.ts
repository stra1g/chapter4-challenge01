import 'dotenv/config'
import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be to authenticate a user", async () => {
    const data = {
      name: "Test",
      email: "test@test.com",
      password: "12345",
    };

    await request(app).post("/api/v1/users").send(data);

    const response = await request(app).post("/api/v1/sessions").send({
      email: data.email,
      password: data.password,
    });

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("token")
  });

  it("should not be to authenticate a user with invalid email", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: 'noexists@email.com',
      password: "12345",
    });

    expect(response.status).toBe(401)
  });

  it("should not be to authenticate a user if password does not match", async () => {
    const data = {
      name: "Test",
      email: "test@valid.com",
      password: "12345",
    };

    await request(app).post("/api/v1/users").send(data);

    const response = await request(app).post("/api/v1/sessions").send({
      email: data.email,
      password: "wrongPassword",
    });

    expect(response.status).toBe(401);
  });
});