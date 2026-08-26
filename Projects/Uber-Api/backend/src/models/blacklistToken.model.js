import mongoose from 'mongoose';

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // Token will be automatically removed after 24 hours
    },
})

const blackListTokenModel = mongoose.model('BlackListToken', blacklistTokenSchema);

export default blackListTokenModel;