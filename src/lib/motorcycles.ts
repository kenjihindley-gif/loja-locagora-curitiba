import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeFirebase } from '@/firebase';

export type MotorcycleSpec = {
  motor: string;
  transmission: string;
  year: string;
  km?: string;
};

export const AVAILABLE_COLORS = [
    { name: "Preto", hex: "#000000" },
    { name: "Branco", hex: "#FFFFFF" },
    { name: "Cinza", hex: "#808080" },
    { name: "Prata", hex: "#C0C0C0" },
    { name: "Vermelho", hex: "#FF0000" },
    { name: "Azul", hex: "#0000FF" },
    { name: "Verde", hex: "#008000" },
    { name: "Amarelo", hex: "#FFFF00" },
    { name: "Laranja", hex: "#FFA500" },
    { name: "Roxo", hex: "#800080" },
    { name: "Marrom", hex: "#A52A2A" },
    { name: "Bege", hex: "#F5F5DC" },
];

export type ColorOption = {
    name: string;
    hex: string;
    imageUrls: string[];
    mainImageIndex: number;
};

// This is the data structure for creating/updating motorcycles.
// It doesn't include the `id` field, as that's managed by Firestore.
export type MotorcycleData = {
  name: string;
  category: '0 KM' | 'Seminova';
  priceAnual?: string;
  priceFidelidade?: string;
  description?: string;
  specs: MotorcycleSpec;
  isNew: boolean;
  km?: string;
  isPromotion: boolean;
  promotionConditions?: string;
  imageHint: string;
  imageUrls: string[]; 
  mainImageIndex: number;
  hasMultipleColors?: boolean;
  colors?: ColorOption[];
};

// This is the data structure for motorcycles retrieved from Firestore.
// It includes the `id` field.
export type Motorcycle = MotorcycleData & {
  id: string;
};


// Helper function to get the Firestore instance.
function getDb() {
    const { firestore } = initializeFirebase();
    return firestore;
}

function getStorageInstance() {
    const { storage } = initializeFirebase();
    return storage;
}

async function compressImageToBase64(blobUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let MAX_WIDTH = 800;
            let MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }
            
            let quality = 0.6;
            let dataUrl = '';
            
            // Loop to ensure the base64 string is not too large (target < 150KB approx)
            // 150KB in base64 is roughly 200,000 characters
            do {
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
                dataUrl = canvas.toDataURL('image/jpeg', quality);
                quality -= 0.1;
                
                // If it's still too big and quality is very low, scale down the dimensions
                if (dataUrl.length > 200000 && quality < 0.3) {
                    width *= 0.8;
                    height *= 0.8;
                    canvas.width = width;
                    canvas.height = height;
                    quality = 0.5; // Reset quality for the new smaller size
                }
            } while (dataUrl.length > 200000 && quality > 0.1);

            resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
        img.src = blobUrl;
    });
}

export async function uploadImage(blobUrl: string, path: string): Promise<string> {
    if (!blobUrl.startsWith('blob:')) return blobUrl;
    
    try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const storage = getStorageInstance();
        const imageRef = ref(storage, path);
        
        const uploadTask = async () => {
            await uploadBytes(imageRef, blob, { contentType: blob.type });
            return await getDownloadURL(imageRef);
        };
        
        const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Upload timeout")), 8000)
        );
        
        return await Promise.race([uploadTask(), timeoutPromise]);
    } catch (error) {
        console.warn("Firebase Storage upload failed, falling back to Base64:", error);
        try {
            return await compressImageToBase64(blobUrl);
        } catch (compressError) {
            console.error("Compression failed:", compressError);
            throw new Error("Não foi possível salvar a imagem. O Firebase Storage não está configurado e o fallback falhou.");
        }
    }
}

export async function getMotorcycles(): Promise<Motorcycle[]> {
    const db = getDb();
    const motorcyclesCol = collection(db, 'motorcycles');
    const motorcycleSnapshot = await getDocs(motorcyclesCol);
    const motorcycleList = motorcycleSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Motorcycle));
    return motorcycleList;
}

export async function getMotorcycleById(id: string): Promise<Motorcycle | undefined> {
    const db = getDb();
    const motorcycleDoc = doc(db, 'motorcycles', id);
    const motorcycleSnapshot = await getDoc(motorcycleDoc);
    if (motorcycleSnapshot.exists()) {
        return { ...motorcycleSnapshot.data(), id: motorcycleSnapshot.id } as Motorcycle;
    }
    return undefined;
}

export async function addMotorcycle(motoData: MotorcycleData): Promise<string> {
    const db = getDb();
    const motorcyclesCol = collection(db, 'motorcycles');
    // Remove undefined fields recursively before sending to Firestore
    const cleanData = JSON.parse(JSON.stringify(motoData));
    const docRef = await addDoc(motorcyclesCol, cleanData);
    return docRef.id;
}

export async function updateMotorcycle(id: string, updatedMotoData: Partial<MotorcycleData>): Promise<void> {
    const db = getDb();
    const motorcycleDoc = doc(db, 'motorcycles', id);
    // Remove undefined fields recursively before sending to Firestore
    const cleanData = JSON.parse(JSON.stringify(updatedMotoData));
    await updateDoc(motorcycleDoc, cleanData);
}

export async function deleteMotorcycle(id: string): Promise<void> {
    const db = getDb();
    const motorcycleDoc = doc(db, 'motorcycles', id);
    await deleteDoc(motorcycleDoc);
}
