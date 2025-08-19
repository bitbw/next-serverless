import { NextRequest, NextResponse } from 'next/server';

export interface CorsOptions {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

export function cors(
  request: NextRequest,
  options: CorsOptions = {}
): NextResponse | null {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders = [
      'X-CSRF-Token',
      'X-Requested-With',
      'Accept',
      'Accept-Version',
      'Content-Length',
      'Content-MD5',
      'Content-Type',
      'Date',
      'X-Api-Version',
      'Authorization'
    ],
    credentials = true,
    maxAge = 86400, // 24 hours
  } = options;

  // 处理预检请求
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    
    // 设置 CORS 头
    if (typeof origin === 'string') {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else if (Array.isArray(origin)) {
      const requestOrigin = request.headers.get('origin');
      if (requestOrigin && origin.includes(requestOrigin)) {
        response.headers.set('Access-Control-Allow-Origin', requestOrigin);
      }
    } else if (origin === true) {
      const requestOrigin = request.headers.get('origin');
      if (requestOrigin) {
        response.headers.set('Access-Control-Allow-Origin', requestOrigin);
      }
    } else {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }

    if (credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    response.headers.set('Access-Control-Allow-Methods', methods.join(', '));
    response.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '));
    response.headers.set('Access-Control-Max-Age', maxAge.toString());
    
    return response;
  }

  return null;
}

// 装饰器函数，用于包装 API 路由处理函数
export function withCors<T extends any[], R>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse> | NextResponse,
  options?: CorsOptions
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    // 处理 CORS 预检请求
    const corsResponse = cors(request, options);
    if (corsResponse) {
      return corsResponse;
    }

    // 调用原始处理函数
    const response = await handler(request, ...args);

    // 为实际响应添加 CORS 头
    const requestOrigin = request.headers.get('origin');
    
    if (typeof options?.origin === 'string') {
      response.headers.set('Access-Control-Allow-Origin', options.origin);
    } else if (Array.isArray(options?.origin)) {
      if (requestOrigin && options.origin.includes(requestOrigin)) {
        response.headers.set('Access-Control-Allow-Origin', requestOrigin);
      }
    } else if (options?.origin === true) {
      if (requestOrigin) {
        response.headers.set('Access-Control-Allow-Origin', requestOrigin);
      }
    } else {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }

    if (options?.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return response;
  };
}
