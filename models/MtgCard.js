import mongoose from "mongoose";

const MtgCardSchema = new mongoose.Schema(
    {
        mtgCardName:{
            type: String,
            required: true,
            min: 2,
            max:100
        },
        mtgCardPrice: {
            type: String,
            required: true
        },
        mtgCardPicturePath: {
            type: String,
            default: "",
        },
        mtgCardUrl: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
)
const MtgCard = mongoose.model("MtgCard", MtgCardSchema);
export default MtgCard;