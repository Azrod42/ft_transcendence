import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class Auth42Service {
  async accessToken(req: string) {
    try {
      const response = await fetch('https://api.intra.42.fr/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=authorization_code&client_id=${process.env.UID_42AUTH}&client_secret=${process.env.SECRET_42AUTH}&code=${req}&redirect_uri=${process.env.URI_42AUTH}`,
      });
      const data = await response.json();
      if (!data)
        throw new HttpException('Empty user token', HttpStatus.BAD_REQUEST);
      return data;
    } catch (error) {
      throw new HttpException('Get user token error', HttpStatus.BAD_REQUEST);
    }
  }

  async getUserInformation(token: string) {
    try {
      const response = await fetch('https://api.intra.42.fr/v2/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('Error on fetch');
    }
    return null;
  }
}
