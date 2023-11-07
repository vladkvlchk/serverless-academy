class CustomError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  static throwError(status, message) {
    throw new CustomError(status, message);
  }
}

export default CustomError