import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const calculateMovingAverage = (data, windowSize) => {
  const smoothedData = [];

  for (let i = 0; i < data.length; i++) {
    let sumBlue = 0;
    let sumGreen = 0;
    let sumRed = 0;
    let count = 0;

    for (let j = Math.max(0, i - windowSize); j <= i; j++) {
      sumBlue += data[j].mean_blue_intensity;
      sumGreen += data[j].mean_green_intensity;
      sumRed += data[j].mean_red_intensity;
      count++;
    }

    smoothedData.push({
      ...data[i],
      mean_blue_intensity: (sumBlue / count).toFixed(2),
      mean_green_intensity: (sumGreen / count).toFixed(2),
      mean_red_intensity: (sumRed / count).toFixed(2),
    });
  }

  return smoothedData;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    const formattedDate = new Date(label).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return (
      <div style={{
        border: "1px solid #ccc",
        borderRadius: '3px',
        margin: "0, 5px",
        padding: "0, 5px",
        lineHeight: "0.2"
      }}>
        <p>{`Timestamp: ${formattedDate}`}</p>
        <p>{`Mean Blue Intensity: ${payload[0].value}`}</p>
        <p>{`Mean Green Intensity: ${payload[1].value}`}</p>
        <p>{`Mean Red Intensity: ${payload[2].value}`}</p>
      </div>
    );
  }

  return null;
};

const IntensityChartComponent = ({ data }) => {
  const sortedData = [...data].sort((a, b) => {
    return a.timestamp_str.localeCompare(b.timestamp_str);
  });
  const smoothedData = calculateMovingAverage(sortedData, 5);

  return (
    <div
      className="chart-box"
      style={{
        border: "1px solid #ccc",
        borderRadius: '3px',
        margin: "10px",
        padding: "0 10px"
      }}
    >
      <LineChart width={400} height={200} data={smoothedData}>
        <XAxis
          dataKey="timestamp_str"
          tick={true}
          tickFormatter={(timestamp) => {
            const formattedDate = new Date(timestamp);

            const formattedDateString = formattedDate.toLocaleString("en-GB", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return formattedDateString;
          }}
        />
        <YAxis domain={[0, 150]} />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="mean_blue_intensity"
          name="Blue MI"
          stroke="rgb(75, 192, 192)"
          strokeWidth={4}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="mean_green_intensity"
          name="Green MI"
          stroke="rgb(0, 128, 0)"
          strokeWidth={1}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="mean_red_intensity"
          name="Red MI"
          stroke="rgb(255, 0, 0)"
          strokeWidth={1}
          dot={false}
        />
      </LineChart>
    </div>
  );
};

export default IntensityChartComponent;
