import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceError } from './GetBalanceError';

import { GetBalanceUseCase } from './GetBalanceUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it("should be able to get balance", async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '12345'
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id as string});

    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");
  })

  it("should not be able to get balance if user does not exists", () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: '9238298239'});
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})