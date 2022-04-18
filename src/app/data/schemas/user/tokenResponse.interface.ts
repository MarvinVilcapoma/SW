export interface TokenResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    issued: Date;
    expires: Date;
    expirationDate: Date;
    errorDescription?: any;
}