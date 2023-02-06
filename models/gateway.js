import mongoose from "mongoose";
import validator from "validator";

const gatewaySchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isIP(value)) {
                throw new Error('Invalid IPv4 address');
            }
        }
    },
    devices: [
        {
            uid: {
                type: Number,
                required: true,
                unique: true
            },
            vendor: {
                type: String,
                required: true
            },
            dateCreated: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ['online', 'offline'],
                required: true
            },
        }
    ]
});

gatewaySchema.pre('save', function(next) {
    const gateway = this
    if (gateway.devices.length > 10) {
        const error = new Error('No more than 10 devices are allowed per gateway')
        next(error)
    }
    next()
})

const Gateway = mongoose.model('Gateway', gatewaySchema);
export default Gateway;
