function checkEmail(email : string) : void{
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      throw new Error('Validation error: invalid email')
    }
  }

export default checkEmail