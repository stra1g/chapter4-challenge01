import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe("Create statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be to create a statement of type deposit", async () => {
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

    const response = await request(app).post("/api/v1/statements/deposit").send({
      amount: 500,
      description: "Test amount"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("amount");
    expect(response.body.amount).toBe(500)
    expect(response.body).toHaveProperty("type");
    expect(response.body.type).toBe("deposit")
  });

  it("should be to create a statement of type withdraw", async () => {
    const data = {
      name: "Test",
      email: "test@test2.com",
      password: "12345",
    };

    await request(app).post("/api/v1/users").send(data);

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: data.email,
      password: data.password,
    });

    const { token } = responseToken.body;

    await request(app).post("/api/v1/statements/deposit").send({
      amount: 500,
      description: "Test amount"
    }).set({
      Authorization: `Bearer ${token}`,
    });
    
    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 200,
      description: "Test amount"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("amount");
    expect(response.body.amount).toBe(200)
    expect(response.body).toHaveProperty("type");
    expect(response.body.type).toBe("withdraw")
  });

  it("should not be able to create a statement of type withdraw if balance is less than amount", async () => {
    const data = {
      name: "Test",
      email: "test@test3.com",
      password: "12345",
    };

    await request(app).post("/api/v1/users").send(data);

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: data.email,
      password: data.password,
    });

    const { token } = responseToken.body;

    await request(app).post("/api/v1/statements/deposit").send({
      amount: 500,
      description: "Test amount"
    }).set({
      Authorization: `Bearer ${token}`,
    });
    
    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 700,
      description: "Test amount"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(400);
  });
});