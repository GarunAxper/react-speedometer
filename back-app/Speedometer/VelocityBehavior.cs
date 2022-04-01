using System;
using System.IO;
using System.Threading;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace Speedometer;

public class VelocityBehavior : WebSocketBehavior
{
    private static readonly string FilePath =
        Path.Combine(Environment.CurrentDirectory , "velocity-data.txt");

    protected override void OnMessage(MessageEventArgs e)
    {
        var data = GetVelocityData();

        while (true)
        {
            foreach (var v in data)
            {
                Thread.Sleep(51);
                Send(v);
            }
        }
    }

    private static string[] GetVelocityData()
    {
        var rawData = File.ReadAllText(FilePath);
        return rawData.Split(", ");
    }
}