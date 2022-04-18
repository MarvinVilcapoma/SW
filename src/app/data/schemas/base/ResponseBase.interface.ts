export interface ResponseBase<T>{
    code: number;
    message?: string;
    messageEN?: string;
    isResultList: boolean;
    listado?: T[];
    objeto: T;
    dato?: any;
}