import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetStatementOperationError } from './GetStatementOperationError';

import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe("Get statement operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository, 
      inMemoryStatementsRepository
    );
  }) 

  it("should be able to get statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '12345'
    });

    const statement = await inMemoryStatementsRepository.create({
      amount: 5000,
      description: "test operation",
      user_id: user.id as string,
      type: OperationType.DEPOSIT
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id as string,
      user_id: user.id as string
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.type).toEqual(OperationType.DEPOSIT)
  });

  it("should not be able to get statement operation if user does not exists", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: 'Test',
        email: 'test@test.com',
        password: '12345'
      });
  
      const statement = await inMemoryStatementsRepository.create({
        amount: 5000,
        description: "test operation",
        user_id: user.id as string,
        type: OperationType.DEPOSIT
      });
  
      await getStatementOperationUseCase.execute({
        statement_id: statement.id as string,
        user_id: '2029323'
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get statement operation if statement does not exists", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: 'Test',
        email: 'test@test.com',
        password: '12345'
      });
  
      await inMemoryStatementsRepository.create({
        amount: 5000,
        description: "test operation",
        user_id: user.id as string,
        type: OperationType.DEPOSIT
      });
  
      await getStatementOperationUseCase.execute({
        statement_id: '3283983',
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should not be able to get statement operation if statement is of another user", () => {
    expect(async () => {
      const user1 = await inMemoryUsersRepository.create({
        name: 'Test',
        email: 'test@test.com',
        password: '12345'
      });

      const user2 = await inMemoryUsersRepository.create({
        name: 'Test',
        email: 'test@email.com',
        password: '12345'
      });
  
      const statement = await inMemoryStatementsRepository.create({
        amount: 5000,
        description: "test operation",
        user_id: user1.id as string,
        type: OperationType.DEPOSIT
      });
  
      await getStatementOperationUseCase.execute({
        statement_id: statement.id as string,
        user_id: user2.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})