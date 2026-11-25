// Keep these two lists the same as src/constants.js on the server.
export const categories = ["Fashion", "Food", "Electronics", "Beauty", "Home"];
export const towns = ["Yenagoa", "Ogbia", "Sagbama", "Brass"];

export const naira = (n) => "₦" + Number(n).toLocaleString("en-NG");

const PALETTE = ["#c2410c", "#0f766e", "#4338ca", "#a16207", "#be185d", "#15803d"];
export const colorFor = (s) => PALETTE[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];

// Asks Cloudinary for a smaller, optimised copy so pages load fast on phones.
export const thumb = (url, w = 600) => url.replace("/upload/", `/upload/w_${w},c_limit,q_auto,f_auto/`);
