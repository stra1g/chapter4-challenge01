import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferValuesError } from './TransferValuesError';

interface IRequest {
  recipient_id: string;
  amount: number;
  description: string;
  sender_id: string;
}

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

@injectable()
class TransferValuesUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ amount, recipient_id, description, sender_id }: IRequest): Promise<Statement> {
    const recipientUser = await this.usersRepository.findById(recipient_id);

    if (!recipientUser) {
      throw new TransferValuesError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new TransferValuesError.InsufficientFunds();
    }

    const statement = await this.statementsRepository.create({ 
      amount,
      description,
      user_id: recipient_id,
      sender_id,
      type: OperationType.TRANSFER,
    });

    return statement;
  }
}

export { TransferValuesUseCase }