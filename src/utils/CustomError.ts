type CustomErrorProps = {
  message: string; 
  status?: number;
}

class CustomError extends Error {
  status: number;

  constructor({ message, status = 500 }: CustomErrorProps) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

export default CustomError;
