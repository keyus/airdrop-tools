export const webshareKey = 'qp3ib2jesv7dxajv53uzdl4ri72h7zzr9n0h3del';
export const webshareHeaders = new Headers({
    "Authorization": `Token ${webshareKey}`
});
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



