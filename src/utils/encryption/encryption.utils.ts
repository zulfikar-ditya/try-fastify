import { appConfig } from "@config";
import * as CryptoJS from "crypto-js";

export class EncryptionUtils {
	private static readonly secretKey = appConfig.APP_KEY || "default-secret-key";

	static encrypt(text: string): string {
		return CryptoJS.AES.encrypt(text, this.secretKey).toString();
	}

	static decrypt(encryptedText: string): string {
		const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
		return bytes.toString(CryptoJS.enc.Utf8);
	}
}
