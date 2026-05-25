const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sportify';
console.log('Connecting to', uri.replace(/\/\/.*@/, '//<credentials>@'));
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => { console.log('MONGO_OK'); process.exit(0); })
  .catch((e) => { console.error('MONGO_ERR', e.message); process.exit(1); });
