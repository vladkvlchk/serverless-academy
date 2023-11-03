function checkDate(_date: string): void{
    const date = new Date(_date);
    if(!(date instanceof Date && !isNaN(+date))){
        throw new Error("Invalid date format")
    }
}

export default checkDate

