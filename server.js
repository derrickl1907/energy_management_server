const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/telemetry', (req, res) => {
  const { voltage, power, limit, status } = req.body;

  const telemetryData = {
    voltage: parseFloat(voltage) || 0,
    power: parseFloat(power) || 0,
    limit: parseFloat(limit) || 0,
    status: status || 'NORMAL',
    timestamp: new Date().toLocaleTimeString()
  };

  console.log('Received Telemetry:', telemetryData);
  io.emit('telemetry_update', telemetryData);

  res.status(200).json({ status: 'success' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
