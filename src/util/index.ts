
export const genWalletList = (data: string[]) => {
    return data.map(key => {
        return {
            key,
            name: key,
            ip: '-',
            openChrome: false,
            openTg: false,
            last_open_time: '',
            chrome_version: '',
        }
    });
}



