// Free Indian postal pincode lookup
// Uses https://api.postalpincode.in/pincode/{pincode}

export interface PincodeResult {
    state: string;
    district: string;
    city: string;
    found: boolean;
}

export async function lookupPincode(pincode: string): Promise<PincodeResult> {
    try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data?.[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            return {
                state: po.State || "",
                district: po.District || "",
                city: po.District || po.Block || "",
                found: true,
            };
        }
    } catch { }
    return { state: "", district: "", city: "", found: false };
}

export const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    // Union Territories
    "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry",
];
