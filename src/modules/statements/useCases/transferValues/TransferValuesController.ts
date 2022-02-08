import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferValuesUseCase } from "./TransferValuesUseCase";

class TransferValuesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      amount,
      description
    } = request.body;
    const { user_id: recipient_id } = request.params;
    const { id: sender_id } = request.user;

    const transferValuesUseCase = container.resolve(TransferValuesUseCase);

    const statement = await transferValuesUseCase.execute({ 
      amount,
      description,
      recipient_id,
      sender_id
    });

    return response.json(statement);
  }
}

export { TransferValuesController }