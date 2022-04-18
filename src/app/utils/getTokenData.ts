import jwt_decode from 'jwt-decode';

interface ITokenBody {
    nameid: string;
    id: string;
    username: string;
    name: string;
    fullname: string;
    nbf: number;
    exp: number;
    iat: number;
}

export default function getDecodedToken(): ITokenBody | null {

  try {
      return jwt_decode(localStorage.getItem('_secret')!);
  } catch (err) {
    return null;
  }
  
}
