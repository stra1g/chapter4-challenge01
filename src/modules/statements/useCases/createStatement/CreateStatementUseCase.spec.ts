import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementError } from './CreateStatementError';

import { CreateStatementUseCase } from './CreateStatementUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

describe("it should be able to create statements", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })
  
  it("should be able to create a statement of type deposit", async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '12345'
    });

    const statement = await createStatementUseCase.execute({
      amount: 5000,
      description: "test operation",
      user_id: user.id as string,
      type: OperationType.DEPOSIT
    });

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toEqual(5000)
    expect(statement.type).toEqual(OperationType.DEPOSIT)
  })

  it("should be able to create a statement of type withdraw", async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '12345'
    });

    await createStatementUseCase.execute({
      amount: 1000,
      description: "test operation",
      user_id: user.id as string,
      type: OperationType.DEPOSIT
    });

    const statement = await createStatementUseCase.execute({
      amount: 500,
      description: "test operation",
      user_id: user.id as string,
      type: OperationType.WITHDRAW
    });

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toEqual(500)
    expect(statement.type).toEqual(OperationType.WITHDRAW)
  });
  
  it("should not be able to create a statement of type withdraw if balance is less than amount", async () => {
    expect(async() => {
      const user = await inMemoryUsersRepository.create({
        name: 'Test',
        email: 'test@test.com',
        password: '12345'
      });
  
      await createStatementUseCase.execute({
        amount: 600,
        description: "test operation",
        user_id: user.id as string,
        type: OperationType.DEPOSIT
      });
  
      await createStatementUseCase.execute({
        amount: 1000,
        description: "test operation",
        user_id: user.id as string,
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});