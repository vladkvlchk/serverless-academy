import CustomError from "../exceptions/custom-error"

function checkPassword(password: string): void {
  if (password.length < 8) {
    CustomError.throwError(400, "Validation error: password length must be at least 8 characters");
  }
}

export default checkPassword