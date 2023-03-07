import MtgCard from "../models/MtgCard.js";
import axios from "axios";
import {load} from "cheerio";

export const getScrapeMtgCard = async (req, res) => {
        const { cardName } = req.params;
        let url = "";
        if(cardName == 'mana-crypt'){
            url = `https://www.mtggoldfish.com/price/Double+Masters/Mana+Crypt#paper`;
        }else if(cardName == 'koth-fire-of-resistance'){
            url = 'https://www.mtggoldfish.com/price/PhyrexiaAll+Will+Be+One:Foil/Koth+Fire+of+Resistance#paper';
        } else if(cardName == 'sol-ring'){
            url = 'https://www.mtggoldfish.com/price/Kaladesh+Inventions:Foil/Sol+Ring#paper';
        } else if(cardName == 'venerated-rotpriest'){
            url = 'https://www.mtggoldfish.com/price/PhyrexiaAll+Will+Be+One/Venerated+Rotpriest#paper'
        }else if(cardName == 'volcanic-island'){
            url = 'https://www.mtggoldfish.com/price/Revised+Edition/Volcanic+Island#paper'
        }else if(cardName == 'cityscape-leveler'){
            url = 'https://www.mtggoldfish.com/price/The+Brothers+War/Cityscape+Leveler#paper'
        }
    try {
        const { data } = await axios.get(url, {
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

        let mtgCard = new MtgCard();
        mtgCard.mtgCardPrice = price;
        mtgCard.mtgCardName = name;
        mtgCard.mtgCardPicturePath = picture;
        res?.json(mtgCard)

    }catch (error){
        console.log(error);
    }
}

// READ
export const getMtgCards = async (req, res) => {
    try {
        const mtgCards = await MtgCard.find();
        res.status(200).json(mtgCards);
    }catch(error){
        res.status(404).json({ message: error.message });
    }
};

export const saveMtgCard = async (req, res) => {
    const { url } = req.body;
    try {
        const { data } = await axios.get(url, {
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
        await mtgCard.save();
        res?.json(mtgCard)

    }catch (error){
        console.log(error);
    }
};