import { DocumentInfo } from './documentInfo';

export class DocumentInfoSerializer {
    /**
     * DeserializeData
     */
    public static Deserialize(textContent: string): DocumentInfo[] {
        var list = JSON.parse(textContent) as (DocumentInfo[]);
        return list;
    }

    /**
     * SerializeData
     */
    public static Serialize(list: DocumentInfo[]):string {
        const serializedData = JSON.stringify(list);
        return serializedData;
    }
}