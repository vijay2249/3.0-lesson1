// export const shorternAddress = (address) => `${address.slice(0,5)}...${address.slice(address.length-4)}`

export const shorternAddress = (address) =>(address? `${address.slice(0,5)}...${address.slice(address.length-4)}` : 'Address')