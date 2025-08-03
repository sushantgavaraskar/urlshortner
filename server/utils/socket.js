const analyticsController = require('../controllers/analyticsController');

const socketHandler = (io) => {
  console.log('🔌 Socket.IO server initialized');

  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.id}`);

    // Join user to their personal room
    socket.on('joinUserRoom', (userId) => {
      console.log('Received joinUserRoom with userId:', userId, 'Type:', typeof userId);
      
      // Handle case where userId is an object
      let actualUserId = userId;
      if (typeof userId === 'object' && userId.userId) {
        actualUserId = userId.userId;
        console.log('Extracted userId from object:', actualUserId);
      }
      
      if (actualUserId) {
        socket.join(actualUserId.toString());
        console.log(`👤 User ${actualUserId} joined their room`);
        
        // Send initial real-time stats
        analyticsController.getRealtimeStats(actualUserId)
          .then(stats => {
            if (stats) {
              socket.emit('initialStats', stats);
            }
          })
          .catch(error => {
            console.error('Error getting initial stats:', error);
          });
      }
    });

    // Handle URL creation
    socket.on('urlCreated', (data) => {
      const { userId, url } = data;
      if (userId) {
        // Emit to user's room
        io.to(userId.toString()).emit('newUrlCreated', {
          url,
          timestamp: new Date()
        });
        
        // Update real-time stats
        analyticsController.getRealtimeStats(userId)
          .then(stats => {
            if (stats) {
              io.to(userId.toString()).emit('statsUpdated', stats);
            }
          });
      }
    });

    // Handle URL click updates
    socket.on('urlClicked', (data) => {
      const { userId, urlId, shortCode, clicks } = data;
      if (userId) {
        io.to(userId.toString()).emit('urlClickUpdate', {
          urlId,
          shortCode,
          clicks,
          timestamp: new Date()
        });
      }
    });

    // Handle real-time stats requests
    socket.on('requestStats', (userId) => {
      console.log('Received requestStats with userId:', userId, 'Type:', typeof userId);
      
      // Handle case where userId is an object
      let actualUserId = userId;
      if (typeof userId === 'object' && userId.userId) {
        actualUserId = userId.userId;
        console.log('Extracted userId from object:', actualUserId);
      }
      
      if (actualUserId) {
        analyticsController.getRealtimeStats(actualUserId)
          .then(stats => {
            if (stats) {
              socket.emit('statsUpdate', stats);
            }
          })
          .catch(error => {
            console.error('Error getting real-time stats:', error);
          });
      }
    });

    // Handle URL deletion
    socket.on('urlDeleted', (data) => {
      const { userId, urlId } = data;
      if (userId) {
        io.to(userId.toString()).emit('urlDeleted', {
          urlId,
          timestamp: new Date()
        });
      }
    });

    // Handle URL updates
    socket.on('urlUpdated', (data) => {
      const { userId, url } = data;
      if (userId) {
        io.to(userId.toString()).emit('urlUpdated', {
          url,
          timestamp: new Date()
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`👤 User disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Make io available to the app
  return io;
};

module.exports = socketHandler; 