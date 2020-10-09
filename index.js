const fetch = require("node-fetch");
const mongoose = require("mongoose");
const zipCodes = require('./zipCodes.json');


mongoose
  .set("useUnifiedTopology", true)
  .set("useCreateIndex", true)
  .connect("mongodb://localhost/apiExtractor", {
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const zipCodeZoneSchema = new mongoose.Schema({
  zipcode: { type: String, maxlength: 10000 },
  zone: { type: String, maxlength: 10 },
  rangemin: { type: String, maxlength: 10 },
  rangemax: { type: String, maxlength: 10 }

});

const ZipCodeZone = mongoose.model("ZipCodeZone", zipCodeZoneSchema);

const createZipCodeZone = async(zipCodeData) => {
  const zipCodeZone = new ZipCodeZone(
    zipCodeData,
  );
  const result = await zipCodeZone.save();
  console.log(result)
}

const zipCodeToPlants = async (zipCode) => {
  try {
    let zipCodeData = await requestZipCodeData(zipCode);

    zipCodeData = {
      zipcode: zipCodeData.zipcode,
      zone: zipCodeData.zone,
      rangemin: zipCodeData.rangemin,
      rangemax: zipCodeData.rangemax,
    };

    createZipCodeZone(zipCodeData);
  } catch (err) {}
};

const requestZipCodeData = async (zipCode) => {
  try {
    // console.log("2 requestZipCodeData running...");
    const zipCodeUrl =
      "https://c0bra.api.stdlib.com/zipcode-to-hardiness-zone/?zipcode=" +
      zipCode;
    const response = await fetch(zipCodeUrl);
    const data = response.json();
    return data;
  } catch (error) {
    console.log("requestZipCodeData error: ", error);
  }
};




// Check Zip
async function getZone(zipCode) {
 const zoneInfo = await ZipCodeZone
  .find({ zipcode: zipCode })
 
 console.log(zoneInfo)
}


getZone(92879);






// Master Extractor
// let i;

// const masterSearch = async () => {
//   for (i = 0; i < zipCodes.zipCodeList.length; i++) {
//     await zipCodeToPlants(zipCodes.zipCodeList[i].Zipcode)
//   }
// }

// masterSearch()

