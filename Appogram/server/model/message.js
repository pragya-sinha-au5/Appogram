const mongoose = require("mongoose");
const Schema = mongoose.Schema
const messageSchema = new Schema(
      {
            to: {
                  type: String,
                  required: true,
            },
            from: {
                  type: String,
                  required: true,
            },
           
            body: {
                  type: String,
                  required: true,
            },
            time: {
                  type: Date,
                  default: new Date().toISOString()

            },
      }
);

mongoose.model("message", messageSchema)