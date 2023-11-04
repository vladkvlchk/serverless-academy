function checkActiveTime(active_time: string): void{
    const options = ['1 day', '3 days', '5 days', 'one-time']
    if(!options.includes(active_time)){
        throw new Error("Invalid active time format [able options: '1 day', '3 days', '5 days', 'one-time']")
    }
}

export default checkActiveTime

