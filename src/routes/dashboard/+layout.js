import { getUserData } from "../../utils/firebase";
export async function load() {  
    const data = await getUserData();
    
    return data; 
}