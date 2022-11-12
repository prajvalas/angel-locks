var express = require('express');
var app = express();
mongoose = require("mongoose")
userSchema = require('./src/models/user')
orgSchema = require('./src/models/org')
donationSchema = require('./src/models/donation')
bodyParser = require('body-parser')
app.use(express.static('src'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
  res.render('index.html');
});

/* Connect to the database */
// mongoose.set("useFindAndModify", true);
mongoose.connect("mongodb://localhost:27017/AngelLocksDB", {
// mongoose.connect(`mongodb://${process.env.MONGODB_URL}:27017/QuotesDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Successfully connected to MongoDB database');
}).catch(err => {
    console.log('error connecting to the database');
    process.exit();
});

if (typeof localStorage === "undefined" || localStorage === null) {
  LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./src');
  // localStorage.removeItem('flagIndex')
}

// if(localStorage.getItem('flagIndex')==='undefined' || localStorage.getItem('flagIndex')===null ) {
//   localStorage.setItem('flagIndex.json', Math.floor((Math.random() * 243) + 1));
// }

app.post("/user/create", (req, res) => {
  let data = req.body;
  userSchema.findOne({
    accountAddress: data.accountAddress
  }).then( async (result)=> {
    if(result){
      res.send({
        msg: "User is already registered!",
        // flag: false,
      })
    }
    else{
      await userSchema.create(data);
      res.status(200).end();
    }
  })
  
});

app.delete("/user/deleteByAddress/:accountAddress", async(req, res) => {
  let _deleteparam = {
    accountAddress : req.params.accountAddress || ""
  }
  const result = await userSchema.deleteMany(_deleteparam)

  res.send(result)
  
});


app.post("/org/create", (req, res) => {
  let data = req.body;
  orgSchema.findOne({
    accountAddress: data.accountAddress
  }).then( async (result)=> {
    if(result){
      res.send({
        msg: "Organization is already registered!"
      })
    }
    else{
      await orgSchema.create(data);
      res.status(200).end();
    }
  })
  
});

app.post("/org/getByAddresses", async(req, res) => {
  let _filter = {
    accountAddress :{
      $in : req.body.accountAddress || []
    }
  }
  const result = await orgSchema.find(_filter)

  res.send(result)
  
});



app.delete("/org/deleteByAddress/:accountAddress", async(req, res) => {
  let _deleteparam = {
    accountAddress : req.params.accountAddress || ""
  }
  const result = await orgSchema.deleteMany(_deleteparam)

  res.send(result)
  
});

/* Add a donation record */
app.post("/donation/create", async(req, res) => {
  let _data = req.body
  const result = await donationSchema.create(_data)
  res.send(result)
  
});

app.post("/donation/donate", async(req, res) => {
  let _data = req.body
  let _hair = await userSchema.findOne({donor_id : req.body.donor_id}, 'gray colored length texture')
  let create_data = {}
  create_data.type = _hair ? (_hair.gray? "Gray": "Colored"):"No specification"
  create_data.length = _hair.length || "0"
  create_data.texture = _hair.texture || ""
  const result = await donationSchema.create({..._data,...create_data})
  res.send(result)
  
});

app.post("/donation/getByIds", async(req, res) => {
  let _filter = {
    donation_id :{
      $in : req.body.donation_id || []
    }
  }
  let result = await donationSchema.find(_filter)
  let userdata = await userSchema.find({accountAddress : result.map((e)=> e.donor_id)},'name contactNo email' )
  let response = result.map((r)=> {
    let u =  (userdata.find((f) => f.accountAddress == r.donor_id)) || {}
    return {...r,...u}
  })

  res.send(response)
  
});

app.listen(3010, function () {
  console.log('Angel Locks Dapp listening on port 3010!');
});