import express from "express";
import Gateway from "../models/gateway.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gateways
 *   description: The gateways managing API
 * /api/gateway:
 *   get:
 *     summary: Lists all the gateways
 *     tags: [Gateway]
 *     responses:
 *       200:
 *         description: The list of the gateways
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gateway'
 *   post:
 *     summary: Create a new gateway
 *     tags: [Gateway]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gateway'
 *     responses:
 *       200:
 *         description: The created gateway.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       500:
 *         description: Some server error
 *
 * /api/gateway/{serial}:
 *   get:
 *     summary: Get a specific gateway by serial number
 *     tags: [Gateway]
 *     parameters:
 *       - in: path
 *         name: serial
 *         schema:
 *           type: string
 *         required: true
 *         description: The gateway serial number
 *     responses:
 *       200:
 *         description: The gateway response by serial number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       404:
 *         description: The gateway was not found
 *
 *   patch:
 *     summary: Update the gateway by the serial number
 *     tags: [Gateway]
 *     parameters:
 *       - in: path
 *         name: serial
 *         schema:
 *           type: string
 *         required: true
 *         description: The gateway serial number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gateway'
 *     responses:
 *       200:
 *         description: The gateway was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       404:
 *         description: The gateway was not found
 *       500:
 *         description: Some error happened
 *
 *   delete:
 *     summary: Remove the gateway by serial number
 *     tags: [Gateway]
 *     parameters:
 *       - in: path
 *         name: serial
 *         schema:
 *           type: string
 *         required: true
 *         description: The gateway serial number
 *
 *     responses:
 *       200:
 *         description: The gateway was deleted
 *       404:
 *         description: The gateway was not found
 *
 * /api/gateway/{serial}/device:
 *   post:
 *     summary: Create a new device
 *     tags: [Device]
 *     parameters:
 *       - in: path
 *         name: serial
 *         schema:
 *           type: string
 *           example: "123456"
 *         required: true
 *         description: The gateway serial number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       200:
 *         description: The created device.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       500:
 *         description: Some server error
 *
 * /api/gateway/{serial}/device/{uid}:
 *   delete:
 *     summary: Remove the device from a gateway by uid
 *     tags: [Device]
 *     parameters:
 *       - in: path
 *         name: serial
 *         schema:
 *           type: string
 *           example: "123456"
 *         required: true
 *         description: The gateway's serial number
 *       - in: path
 *         name: uid
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: The device's uid
 *     responses:
 *       200:
 *         description: The device was deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       404:
 *         description: The gateway or device was not found
 *       500:
 *         description: Some server error
 */

router.get("/", async (req, res) => {
    const gateways = await Gateway.find();
    res.send(gateways);
});

router.get("/:serial", async (req, res) => {
    try {
        const gateway = await Gateway.findOne({ serialNumber: req.params.serial });
        if (!gateway)
            return res.status(404).json({ message:"Gateway not found"});
        res.send(gateway);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.post("/", async (req, res) => {
    const gateway = new Gateway(req.body);
    try{
        await gateway.save();
        res.send(gateway);
    }catch (e) {       
        res.status(400).json({ message: e.message });
    }
});

router.patch("/:serial", async (req, res) => {
    const gateway = await Gateway.findOneAndUpdate({ serialNumber: req.params.serial }, req.body, {
        new: true,
    });
    if (!gateway)
        return res.status(404).json({ message: "Gateway not found"});
    res.send(gateway);
});

router.delete("/:serial", async (req, res) => {
    const gateway = await Gateway.findOneAndDelete({ serialNumber: req.params.serial });
    if (!gateway)
        return res.status(404).json({ message: "Gateway not found"});
    res.send(gateway);
});

router.post("/:serial/device", async (req, res) => {
    const gateway = await Gateway.findOne({ serialNumber: req.params.serial });
    if (!gateway) return res.status(404).json({ message: "Gateway not found"});

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
        res.status(400).json({ message: e.message});
    }
});

router.delete('/:serial/device/:uid', async (req, res) => {
    const gateway = await Gateway.findOne({ serialNumber: req.params.serial });
    if (!gateway) return res.status(404).json({ message: "Gateway not found"});

    const device =  gateway.devices.filter(function(e){
        return e.uid == req.params.uid;
    });
    if (device.length === 0) return res.status(404).json({ message:"Device not found"});

    await Gateway.updateOne({ "serialNumber": req.params.serial }, { $pull: { devices : {uid: req.params.uid}}});

    res.send(device[0]);
});


export default router;
