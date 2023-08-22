import express, { Application, Request, Response } from "express";
import { customerRecords } from "./Payload";

const app: Application = express();

app.use(express.json());

interface CustomerRecord {
    userId: number;
    fromName: string;
    from_num: string;
    timestamp: string;
    type: string;
}

app.get('/callrecord', (req: Request, res: Response) => {

    const sortedData = customerRecords.sort((a: CustomerRecord, b: CustomerRecord) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampA - timestampB;
    });

    const uniqueData: CustomerRecord[] = [];
    const seenIds = new Set<number>();
    sortedData.forEach((item: CustomerRecord) => {
        if (!seenIds.has(item.userId)) {
            seenIds.add(item.userId);
            uniqueData.push(item);
        }
    });

    const callRecord = uniqueData.map((item: CustomerRecord) => {
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