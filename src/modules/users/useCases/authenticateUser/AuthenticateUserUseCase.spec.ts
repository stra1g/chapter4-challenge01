import 'dotenv/config'

import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to authenticate a user", async () => {
    const user = {
      email: "user@test.com",
      password: "1234",
      name: "User test",
    };

    await createUserUseCase.execute(user);

    const tokenInfo = await authenticateUserUseCase.execute({ 
      email: user.email, 
      password: user.password
    });

    expect(tokenInfo).toHaveProperty('token');
  });

  it("should not be to authenticate a user with invalid email", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({ 
        email: 'invalidEmail@email.com', 
        password: '12345'
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be to authenticate a user with invalid email", () => {
    expect(async () => {
      const user = {
        email: "user@test.com",
        password: "1234",
        name: "User test",
      };
  
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({ 
        email: user.email, 
        password: 'wrongPassword'
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})