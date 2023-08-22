"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Payload_1 = require("./Payload");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/callrecord', (req, res) => {
    const sortedData = Payload_1.customerRecords.sort((a, b) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampA - timestampB;
    });
    const uniqueData = [];
    const seenIds = new Set();
    sortedData.forEach((item) => {
        if (!seenIds.has(item.userId)) {
            seenIds.add(item.userId);
            uniqueData.push(item);
        }
    });
    const callRecord = uniqueData.map((item) => {
        return {
            name: item.fromName,
            phoneNumber: item.from_num,
            id: item.userId,
            startTime: item.timestamp,
            callType: item.type
        };
    });
    return res.json({
        callRecord
    });
});
const Port = process.env.PORT || 5000;
app.listen(Port, () => {
    console.log(`Server is up at port ${Port}`);
});
