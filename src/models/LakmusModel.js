import mongoose from "mongoose";

const lakmusSchema = {
  text: { type: String, requied: true, default: "yellLowLakmUs" },
};

const Lakmus = mongoose.models.Lakmus || mongoose.model("Lakmus", lakmusSchema);

module.exports = Lakmus;
