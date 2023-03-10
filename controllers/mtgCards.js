import MtgCard from "../models/MtgCard.js";
import axios from "axios";
import {load} from "cheerio";
import schedule from "node-schedule";


schedule.scheduleJob('*/30 * * * *', function () {
    scheduledCardPriceCheck().then(() => console.log('All Prices Updated'));
})

// PRICE SCHEDULER
async function scheduledCardPriceCheck() {
    try {
        const mtgCards = await MtgCard.find();
        let mtgCard = new MtgCard();
        await Promise.all(mtgCards.map(async (card) => {
            try {
                mtgCard = await scrapingPriceCard(card.mtgCardUrl);
                if (mtgCard.mtgCardPrice !== card.mtgCardPrice) {
                    let query = {_id: card._id}
                    let newPrice = {$set: {mtgCardPrice: mtgCard.mtgCardPrice}}
                    MtgCard.updateOne(query, newPrice, function (err, res) {
                        if (err) throw err;
                        console.log(card._id + " updated");
                    });
                }
            } catch (err) {
                console.log(err);
            }
        }))
    } catch (err) {
        console.log({message: err.message});
    }
}
// READ
export const getMtgCards = async (res) => {
    try {
        const mtgCards = await MtgCard.find();
        res.status(200).json(mtgCards);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

// DELETE
export const deleteMtgCard = async (req, res) => {
    const {id} = req.params;
    try {
        await MtgCard.deleteOne({_id: id});
        res.status(200).json({msg: "Card deleted"})
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

// SAVE
export const saveMtgCard = async (req, res) => {
    const {url} = req.body;
    try {
        res?.json(await scrapingFullCard(url, true))
    } catch (error) {
        console.log(error);
    }
};

const scrapingFullCard = async (url) => {

    const {data} = await axios.get(url, {
        headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            "Content-Type": 'application/json;charset=UTF-8',
        }
    })

    const $ = load(data);
    const price = $(".price-card-current-prices .price-box-container .paper .price-box-price").text();
    const name = $(".price-card-name-header .price-card-name-container .price-card-name-header-name").text();
    const picture = $(".price-card-image .price-card-image-image").attr('src')

    const mtgCard = new MtgCard();
    mtgCard.mtgCardPrice = price;
    mtgCard.mtgCardName = name;
    mtgCard.mtgCardPicturePath = picture;
    mtgCard.mtgCardUrl = url;
    await mtgCard.save();
    return mtgCard;
}

const scrapingPriceCard = async (url) => {

    const {data} = await axios.get(url, {
        headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            "Content-Type": 'application/json;charset=UTF-8',
        }
    })

    const $ = load(data);
    const price = $(".price-card-current-prices .price-box-container .paper .price-box-price").text();

    const mtgCard = new MtgCard();
    mtgCard.mtgCardPrice = price;
    return mtgCard;
}