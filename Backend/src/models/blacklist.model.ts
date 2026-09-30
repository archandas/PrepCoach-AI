import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true,"token is needed to blacklist"]
    },
},
{
    timestamps: true
}
);

const BlacklistUser = mongoose.model("BlacklistUser", blacklistTokenSchema);

export default BlacklistUser;