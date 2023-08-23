import express, { Application, Request, Response } from "express";
import { customerRecords } from "./Payload";

const app: Application = express();

app.use(express.json());

interface CustomerRecord {
    id: string;
    domain: string;
    direction: string;
    text: string;
    userId: number;
    fromName: string;
    from_num: string;
    timestamp: string;
    type: string;
    toName: string;
}

app.get('/masterdata', (req: Request, res: Response) => {
    const userIds: number[] = customerRecords.map((item: CustomerRecord) => item.userId);
    return res.redirect(`/callrecord/${userIds.join(',')}`);
});

app.get('/callrecord/:ids', (req: Request, res: Response) => {
    const receivedIds: number[] = req.params.ids.split(',').map(id => parseInt(id, 10));
    const masterData: CustomerRecord[] = customerRecords.filter(item => receivedIds.includes(item.userId));
    
    const sortedData: CustomerRecord[] = customerRecords.sort((a, b) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampA - timestampB;
    });

    const uniqueData: CustomerRecord[] = [];
    const seenIds: Set<number> = new Set();
    sortedData.forEach(item => {
        if (!seenIds.has(item.userId)) {
            seenIds.add(item.userId);
            uniqueData.push(item);
        }
    });

    const callRecord: CustomerRecord[] = uniqueData.filter(item => receivedIds.includes(item.userId));

    return res.status(200).json({
        masterData,
        callRecord
    });
});

const Port = process.env.PORT || 5000;
app.listen(Port, () => {
    console.log(`Server is up at port ${Port}`);
});
