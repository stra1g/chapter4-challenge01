import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create a new user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '12345'
    });

    expect(user).toHaveProperty("id")
  });

  it("should not be able to create a new user with same email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'Test',
        email: 'test@test.com',
        password: '12345'
      });
  
      await createUserUseCase.execute({
        name: 'Test',
        email: 'test@test.com',
        password: '12345'
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});