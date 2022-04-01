using Speedometer;
using WebSocketSharp.Server;

const string socketUrl = "ws://localhost:12345";
const string socketPath = "/Velocity";

var webSocketServer = new WebSocketServer(socketUrl);

webSocketServer.AddWebSocketService<VelocityBehavior>(socketPath);
webSocketServer.Start();

Console.ReadKey(true);
webSocketServer.Stop();