import { WebSocket, WebSocketServer } from 'ws';
import { jwt } from 'jsonwebtoken';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws: WebSocket, request: Request) {
  ws.on('error', console.error);

    const url = request.url;
    if(!url) return;
    
    const connectionUrl = new URL(url);
    const params = connectionUrl.searchParams; 
    const token = params.get('token');
    const decoded = jwt.verify(token, 'secret');
    
    if(typeof decoded === 'string') {
        ws.close();
        return;
    }

    if(!decoded || !decoded.userId) {
        ws.close();
        return;
    }

    ws.on('message', function message(data: any) {
        console.log('received: %s', data);
    });

    ws.send('something');
});