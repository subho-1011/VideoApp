import mongoose, { Document, Model, Schema } from "mongoose";

interface SubscriptionDocument extends Document {
    subscriber: Schema.Types.ObjectId;
    channel: Schema.Types.ObjectId;
}

const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        channelToSubscribed: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Subscription: Model<SubscriptionDocument> =
    mongoose.models.Subscription || mongoose.model<SubscriptionDocument>("Subscription", subscriptionSchema);

export default Subscription;
