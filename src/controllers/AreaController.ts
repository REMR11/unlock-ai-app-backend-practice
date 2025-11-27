import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const registrarArea = async (areaId:string) => {
    const areaRef = doc(db, "areas", areaId);
    const areaSnap = await getDoc(areaRef);

    if(areaSnap.exists()){
        await updateDoc(areaRef, {
            count: increment(1),
            timestamp: new Date()
        })
    }
}