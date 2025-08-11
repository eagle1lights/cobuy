const KEY_NAME="e2eeKeyJwk";
async function getOrCreateKey():Promise<CryptoKey>{ const existing=localStorage.getItem(KEY_NAME); if(existing){const jwk=JSON.parse(existing); return await crypto.subtle.importKey("jwk",jwk,{name:"AES-GCM",length:256},true,["encrypt","decrypt"]);}
 const key=await crypto.subtle.generateKey({name:"AES-GCM",length:256},true,["encrypt","decrypt"]); const jwk=await crypto.subtle.exportKey("jwk",key); localStorage.setItem(KEY_NAME,JSON.stringify(jwk)); return key;}
export async function getKey(){return getOrCreateKey();}
export async function encryptBytes(plain:Uint8Array){ const key=await getOrCreateKey(); const iv=crypto.getRandomValues(new Uint8Array(12)); const cipher=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv},key,plain)); return {iv,cipher};}
export async function decryptBytes(iv:Uint8Array,cipher:Uint8Array){ const key=await getOrCreateKey(); const plain=new Uint8Array(await crypto.subtle.decrypt({name:"AES-GCM",iv},key,cipher)); return plain;}
