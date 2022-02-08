import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { TransferValuesUseCase } from "./TransferValuesUseCase";
import { TransferValuesError } from './TransferValuesError';

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository
let transferValuesUseCase: TransferValuesUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

describe("Transfer values", () => {
  beforeAll(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    transferValuesUseCase = new TransferValuesUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  })

  it("should not be able to transfer values between accounts if recipient user does not exists", () => {
    expect(async () => {
      await transferValuesUseCase.execute({
        amount: 5000,
        description: 'Test description',
        recipient_id: '23323',
        sender_id: '30293'
      });
    }).rejects.toBeInstanceOf(TransferValuesError.UserNotFound);
  });

  it("should not be able to transfer values between accounts if balance is balance is less than amount", async () => {
    const user = await inMemoryUsersRepository.create({ 
      name: 'Test name', 
      email: 'test@mail.com',
      password: '123456'
    });

    expect(async () => {
      await transferValuesUseCase.execute({
        amount: 5000,
        description: 'Test description',
        recipient_id: user.id as string,
        sender_id: '30293'
      });
    }).rejects.toBeInstanceOf(TransferValuesError.InsufficientFunds);
  });

  it("should be able to transfer values between accounts", async () => {
    const recipientUser = await inMemoryUsersRepository.create({ 
      name: 'Test name', 
      email: 'test@mail.com',
      password: '123456'
    });

    await inMemoryStatementsRepository.create({ 
      user_id: '30293', 
      description: 'Deposit',
      amount: 4000,
      type: OperationType.DEPOSIT
    });

    const transferData = await transferValuesUseCase.execute({
      amount: 1000,
      description: 'Test description',
      recipient_id: recipientUser.id as string,
      sender_id: '30293'
    });

    expect(transferData).toHaveProperty('id');
    expect(transferData).toHaveProperty('type');
    expect(transferData.type).toBe(OperationType.TRANSFER);
  });
})