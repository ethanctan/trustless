import mongoose from 'mongoose';
const MyModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
export default MyModel