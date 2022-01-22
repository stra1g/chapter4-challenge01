import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      email: "admin@email.com",
      name: "test",
      password: "1234"
    });

    const profile = await showUserProfileUseCase.execute(user.id as string);

    expect(profile).toHaveProperty("id")
  })

  it("should not be able to show user profile if user does not exists", () => {
    expect(async () => {
      await showUserProfileUseCase.execute('22332');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})