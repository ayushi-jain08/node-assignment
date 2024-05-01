import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp:{
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600, // TTL index set to expire documents after 3600 seconds (one hour)
    default: Date.now,
  },
});

//Export the model
const Otp = mongoose.model("otp", otpSchema);

export default Otp;
