const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ishagohel181:JHf4FanNi8VCBZz0@cluster0.pmyvsgz.mongodb.net/data_knowledge?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const count = await mongoose.connection.collection("consultationslots").countDocuments();
    console.log("Total slots:", count);
    const futureSlots = await mongoose.connection.collection("consultationslots").find({ startTime: { $gte: new Date() } }).toArray();
    console.log("Future slots:", futureSlots.length);
    if(futureSlots.length > 0) { console.log("Latest future slot:", futureSlots[0]); }
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
