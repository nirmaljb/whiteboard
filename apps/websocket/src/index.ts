import { WebSocket, WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

const wss = new WebSocketServer({ port: 8080 });

function jwtTokenValidation(token: string): string | null {
    
    const decoded = jwt.verify(token, 'secret');
    
    if(typeof decoded === 'string') {
        return null;
    }

    if(!decoded || !decoded.userId) {
        return null;
    }

    //@ts-ignore
    return decoded.sub.user_id;
} 

wss.on('connection', function connection(ws: WebSocket, request: Request) {
  ws.on('error', console.error);

    const url = request.url;
    if(!url) return;

    
    const connectionUrl = new URL(url);
    const params = connectionUrl.searchParams; 
    const token = params.get('token') || "";

    const decodedUserId = jwtTokenValidation(token);
    if(!decodedUserId) {
        ws.close();
        return;
    }

    
    

    ws.on('message', function message(data: any) {
        console.log('received: %s', data);
    });

    ws.send('something');
});