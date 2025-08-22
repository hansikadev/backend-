import mongoose ,{ Schema } from 'mongoose';

const subscriptionSchema = new Schema({
    Subscriber:{
        type: Schema.Types.ObjectId, // one who is subscribing
        ref: 'User',
    },
    channel:{
        type: Schema.Types.ObjectId, // one to whom user is subscribing
        ref: 'User',
    }
},{timestamp:true});
  
export const Subscription = mongoose.model('Subscription', subscriptionSchema);