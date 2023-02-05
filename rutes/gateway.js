import express from "express";
import Gateway from "../models/gateway.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
    const gateways = await Gateway.find();
    res.send(gateways);
});

router.get("/:id", async (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send("Invalid ID");
    try {
        const gateway = await Gateway.findById(req.params.id);
        if (!gateway)
            return res.status(404).send("Gateway not found");
        res.send(gateway);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.post("/", async (req, res) => {
    const gateway = new Gateway(req.body);
    try{
        await gateway.save();
        res.send(gateway);
    }catch (e) {
        res.status(400).send(e.message)
    };
});

router.patch("/:id", async (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send("Invalid ID");
    const gateway = await Gateway.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!gateway)
        return res.status(404).send("Gateway not found");
    res.send(gateway);
});

router.delete("/:id", async (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send("Invalid ID");
    const gateway = await Gateway.findByIdAndDelete(req.params.id);
    if (!gateway)
        return res.status(404).send("Gateway not found");
    res.send(gateway);
});

router.post("/:gatewayId/device", async (req, res) => {
    const gateway = await Gateway.findById(req.params.gatewayId);
    if (!gateway) return res.status(404).send('Gateway not found.');

    const device = {
        uid: req.body.uid,
        vendor: req.body.vendor,
        dateCreated: req.body.dateCreated,
        status: req.body.status
    };

    try {
        gateway.devices.push(device);
        await gateway.save();

        res.status(201).send(device);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.delete('/:gatewayId/device/:uid', async (req, res) => {
    const gateway = await Gateway.findById(req.params.gatewayId);
    if (!gateway) return res.status(404).send('Gateway not found.');

    const device =  gateway.devices.filter(function(e){
        return e.uid == req.params.uid;
    });
    if (device.length == 0) return res.status(404).send('Device not found.');

    await Gateway.updateOne({ "_id": req.params.gatewayId }, { $pull: { devices : {uid: req.params.uid}}});

    res.send(device);
});


export default router;
