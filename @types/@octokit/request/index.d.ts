declare module '@octokit/request' {

  type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';
    body?: string,
    headers?: {},
    redirect?: any
  }

  type RequestResponse = {
    data: any,
    status: number,
    url: string,
    headers: {}
  }

  export default function request(uri: string, options?: {}): Promise<RequestResponse>;
}