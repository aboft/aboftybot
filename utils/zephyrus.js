const axios = require('axios');

const url = 'https://www.bestbuy.com/site/asus-rog-zephyrus-g14-14-gaming-laptop-amd-ryzen-9-16gb-memory-nvidia-geforce-rtx-2060-1tb-ssd-moonlight-white/6403816.p?skuId=6403816'

const inStock = async () => {
	const canBuy = await axios.get(url)
    .then(res => {
        const isComing = res.data.search(/Coming Soon/g)
        if (isComing === -1) {
            return "IT IS IN STOCK"
        } else {
            return "NOT IN STOCK"
        }
    })
	return canBuy
}

module.exports = inStock
