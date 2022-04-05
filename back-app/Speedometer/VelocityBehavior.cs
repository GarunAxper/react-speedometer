using Utf8Json;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace Speedometer;

public class VelocityBehavior : WebSocketBehavior
{
    private static readonly string FilePath = Path.Combine(Environment.CurrentDirectory, "velocity-data.txt");

    protected override void OnMessage(MessageEventArgs e)
    {
        var data = GetVelocityData();

        while (true)
        {
            foreach (var v in data)
            {
                Thread.Sleep(51);
                var telemetry = JsonSerializer.ToJsonString(GetTelemetryData(v));
                Send(telemetry);
            }
        }
    }

    private static TelemetryData GetTelemetryData(int velocity)
    {
        return new TelemetryData
        {
            Velocity = velocity,
            Gear = velocity / 43 + 1,
            Rpm = (int) (velocity / 4.3) % 10 + 1
        };
    }

    private static int[] GetVelocityData()
    {
        var rawData = File.ReadAllText(FilePath);
        return rawData.Split(", ").Select(int.Parse).ToArray();
    }
}