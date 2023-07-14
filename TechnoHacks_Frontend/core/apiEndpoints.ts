class ApiEndpoints {
  static serverURL: string =
    process.env.NEXT_SERVER_URL || process.env.NODE_ENV == 'development'
      ? 'http://localhost:5000'
      : 'https://server.technohacks.gokulsreejith.com';

  static baseURL: string = `${this.serverURL}/api/v1`;

  // User
  static user: string = '/user';
  static login: string = `${this.user}/login`;
  static register: string = `${this.user}/register`;
  static profile: string = `${this.user}/profile`;
}

export default ApiEndpoints;
