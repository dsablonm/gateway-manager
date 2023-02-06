import express from "express";
import Gateway from "../models/gateway.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
    const gateways = await Gateway.find();
    res.send(gateways);
});

router.get("/:serial", async (req, res) => {
    try {
        const gateway = await Gateway.findOne({ serialNumber: req.params.serial });
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

router.patch("/:serial", async (req, res) => {
    const gateway = await Gateway.findOneAndUpdate({ serialNumber: req.params.serial }, req.body, {
        new: true,
    });
    if (!gateway)
        return res.status(404).send("Gateway not found");
    res.send(gateway);
});

router.delete("/:serial", async (req, res) => {
    const gateway = await Gateway.findOneAndDelete({ serialNumber: req.params.serial });
    if (!gateway)
        return res.status(404).send("Gateway not found");
    res.send(gateway);
});

router.post("/:serial/device", async (req, res) => {
    const gateway = await Gateway.findOne({ serialNumber: req.params.serial });
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

router.delete('/:serial/device/:uid', async (req, res) => {
    const gateway = await Gateway.findOne({ serialNumber: req.params.serial });
    if (!gateway) return res.status(404).send('Gateway not found.');

    const device =  gateway.devices.filter(function(e){
        return e.uid == req.params.uid;
    });
    if (device.length == 0) return res.status(404).send('Device not found.');

    await Gateway.updateOne({ "serialNumber": req.params.serial }, { $pull: { devices : {uid: req.params.uid}}});

    res.send(device);
});


export default router;
