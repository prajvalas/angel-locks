App = {
  web3: null,
  contracts: {},
  address: '0x45c49bbBDc03eA74547914e39a15609db1cbFf98',
  network_id: 5777, // 5777 for local
  handler: null,
  value: 1000000000000000000,
  index: 0,
  margin: 10,
  left: 15,
  init: function () {

    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      App.web3 = new Web3(Web3.givenProvider);
    } else {
      App.web3 = new Web3(App.url);
    }
    ethereum.enable();
    // })

    return App.initContract();
  },

  initContract: function () {
    App.contracts.Angellocks = new App.web3.eth.Contract(App.abi, App.address, {});
    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '#registeruser', function () {
      $("#donorForm").css("display", "none");
      $(".loader").css("display", "inline-block");
      App.populateAddress().then(r => {
        App.handler = r[0]
      }).then(() => {
        // App.handleRegister(jQuery('#Initialize').val())
        var registerdata = {
          name: jQuery('#name').val(),
          email: jQuery('#email').val(),
          dob: jQuery('#dob').val(),
          contactNo: jQuery('#contactno').val(),
          gender: jQuery('#gender').val(),
          status: 'NEW',
          accountAddress: App.handler.toLowerCase(),
        }
        // var array = $.map($('input[name="type"]:checked'), function(c){return c.value; })

        var hairtype = {
          // permed : $("#permed").is(':checked'),
          // gray : $("#gray").is(':checked'),
          // colored : $("#colored").is(':checked'),
          gray: false,
          colored: false,
          length: parseInt(jQuery('#length').val()),
          wavy: false,
          curly: false,
          straight: false,
        }
        hairtype[$('#texture').val()] = true
        hairtype[$('#type').val()] = true

        var mongohair = {
          ...hairtype, ...{ texture: $('#texture').val() }
        }
        // for (i in array){
        //   hairtype[array[i]] = true
        // }
        App.handleUserRegister(registerdata, hairtype, mongohair)
        // App.handleRegister(jQuery('#name').val(), jQuery('#email').val(), jQuery('#dob').val(), jQuery('#contactno').val(), jQuery('#gender').val())
        // .then(()=> {
        //   console.log("Done");
        // })
      })
      // App.handleInitialization(jQuery('#Initialize').val());
    });
    $(document).on('click', '#registerorg', function () {
      $("#orgRegForm").css("display", "none");
      $(".loader").css("display", "inline-block");
      App.populateAddress().then(r => {
        App.handler = r[0]
      }).then(() => {
        // App.handleRegister(jQuery('#Initialize').val())
        var registerdata = {
          name: jQuery('#orgname').val(),
          email: jQuery('#orgemail').val(),
          contactNo: jQuery('#orgcontactno').val(),
          address: jQuery('#orgaddress').val(),
          status: 'NEW',
          accountAddress: App.handler,
        }
        // var typearray = $.map($('input[name="orgtype"]:checked'), function(c){return c.value; })

        var hairtype = {
          gray: $("#orggray").is(':checked'),
          colored: $("#orgcolored").is(':checked'),
          length: parseInt(jQuery('#orglength').val()),
          wavy: $("#orgwavy").is(':checked'),
          curly: $("#orgcurly").is(':checked'),
          straight: $("#orgstraight").is(':checked'),

        }
        // for (i in typearray){
        //   hairtype[typearray[i]] = true
        // }
        // for (i in textarray){
        //   hairtype[textarray[i]] = true
        // }
        App.handleOrgRegister(registerdata, hairtype)
        // App.handleRegister(jQuery('#name').val(), jQuery('#email').val(), jQuery('#dob').val(), jQuery('#contactno').val(), jQuery('#gender').val())
        // .then(()=> {
        //   console.log("Done");
        // })
      })
      // App.handleInitialization(jQuery('#Initialize').val());
    });
    $(document).on('click', '#viewmatches', function () {
      $(".loader").css("display", "inline-block");
      App.populateAddress().then(r => App.handler = r[0]).then(() => {
        App.handleViewMatches();
      })

    });
    $(document).on('click', '[id^=donate_]', function () {
      $(".loader").css("display", "inline-block");
      $("#viewMatchesForm").css("opacity","0.3");
      App.populateAddress().then(r => App.handler = r[0]).then(() => {
        let orgAddress = $(this).attr('id').split("_")[1];
        console.log(orgAddress);
        App.handleDonate(orgAddress);
        // console.log('event triggered for ',$(this).attr('id'))
      })

    });
    $(document).on('click', '#viewStatus', function () {
      $(".loader").css("display", "inline-block");
      App.populateAddress().then(r => App.handler = r[0]).then(() => {
        App.handleViewStatus();
      })

    });
    $(document).on('click', '#viewDonations', function () {
      $(".loader").css("display", "inline-block");
      App.populateAddress().then(r => App.handler = r[0]).then(() => {
        App.handleViewDonations();
      })

    });

    $(document).on('click', '[id^=accept_]', function () {
      $(".loader").css("display", "inline-block");
      App.populateAddress().then(r => App.handler = r[0]).then(() => {
        let donation_id = $(this).attr('id').split("_")[1];
        console.log(donation_id);
        App.handleDecision(donation_id, 1);
        // console.log('event triggered for ',$(this).attr('id'))
      })
    });

    $(document).on('click', '[id^=reject_]', function () {
      $(".loader").css("display", "inline-block");
      App.populateAddress().then(r => App.handler = r[0]).then(() => {
        let donation_id = $(this).attr('id').split("_")[1];
        console.log(donation_id);
        App.handleDecision(donation_id, 2);
        // console.log('event triggered for ',$(this).attr('id'))
      })

    });

    //App.populateAddress().then(r => App.handler = r[0]);
  },
  populateAddress: async function () {
    // App.handler=App.web3.givenProvider.selectedAddress;
    // var res = await ethereum.request({ method: 'eth_requestAccounts' });
    // web3.eth.defaultAccount= "0x80adE0F380De8441CCCaBf2CabcA7C956d8fD7f5";
    let res = await ethereum.request({ method: 'eth_requestAccounts' });
    console.log(res)
    return res
  },

  handleUserRegister: async function (registerdata, hairtype, mongohair) {
    let _data = { ...registerdata, ...mongohair }
    $.ajax({
      type: 'POST', url: `http://localhost:3010/user/create`, data: _data,
    }).done(function (res) {
      _alertmessage = res.msg || "Thank you for registering!"
      console.log(res);
      toastr.success(_alertmessage)
      if (!res.msg) {
        var option = { from: App.handler }
        console.log(option)
        // console.log(App.contracts.Angellocks.methods)
        // console.log(hairtype.permed, hairtype.gray, hairtype.colored, hairtype.length, hairtype.texture)
        App.contracts.Angellocks.methods.register(
          // 0,hairtype.permed, hairtype.gray, hairtype.colored, hairtype.length, hairtype.wavy,  hairtype.curly,  hairtype.straight)
          0, hairtype.gray, hairtype.colored, hairtype.length, hairtype.wavy, hairtype.curly, hairtype.straight)
          .send(option)
          .on('receipt', (receipt) => {
            if (receipt.status) {
              console.log("Success it seems")
              $(".loader").css("display", "none");
              $("#maindiv").css("opacity", 1);
              toastr.success("Registered on blockchain");

            }
          })
          .on('error', (err) => {
            // Delete from Mongo using Node API
            $.ajax({
              type: 'DELETE', url: `http://localhost:3010/user/deleteByAddress/${App.handler}`,
            }).done(function (res) {
              console.log('Data deleted from mongo db due to error in smart contract')
              console.log(err)
              $(".loader").css("display", "none");
              $("#maindiv").css("opacity", 1);
              toastr.error("Error ocurred in registration process");

            })

          })
      }
      else {
        $(".loader").css("display", "none");
        $("#maindiv").css("opacity", 1);
      }

    })

  },

  handleOrgRegister: async function (registerdata, hairtype) {
    let _data = registerdata
    $.ajax({
      type: 'POST', url: `http://localhost:3010/org/create`, data: _data,
    }).done(function (res) {
      _alertmessage = res.msg || "Thank you for registering!"
      console.log(res);
      toastr.success(_alertmessage)
      if (!res.msg) {
        var option = { from: App.handler }
        console.log(option)
        // console.log(App.contracts.Angellocks.methods)
        // console.log(hairtype.permed, hairtype.gray, hairtype.colored, hairtype.length, hairtype.texture)
        App.contracts.Angellocks.methods.register(
          1, hairtype.gray, hairtype.colored, hairtype.length, hairtype.wavy, hairtype.curly, hairtype.straight)
          // 1,hairtype.permed, hairtype.gray, hairtype.colored, hairtype.length, hairtype.wavy,  hairtype.curly,  hairtype.straight)
          .send(option)
          .on('receipt', (receipt) => {
            if (receipt.status) {
              console.log("Success it seems for org")
              $(".loader").css("display", "none");
              $("#maindiv").css("opacity", 1);
              toastr.success("Organization registered on blockchain");

            }
          })
          .on('error', (err) => {
            // Delete from Mongo using Node API
            $.ajax({
              type: 'DELETE', url: `http://localhost:3010/org/deleteByAddress/${App.handler}`,
            }).done(function (res) {
              console.log('Data deleted from mongo db due to error in smart contract')
              console.log(err)
              $(".loader").css("display", "none");
              $("#maindiv").css("opacity", 1);
              toastr.error("Error occurred in registration process");

            })

          })
      }
      else {
        $(".loader").css("display", "none");
        $("#maindiv").css("opacity", 1);
      }

    })

  },

  handleViewMatches: function () {

    // var option = { from: App.handler }
    App.contracts.Angellocks.methods.match_org(App.handler)
      .call()
      .then(async (results) => {
        // if (receipt.status) {
        console.log("Success it seems")
        $(".loader").css("display", "none");
        console.log(results);
        var orgs = results.filter((e) => e != '0x0000000000000000000000000000000000000000')
        orgs = orgs.map((o) => o.toLowerCase())
        // jQuery('#counter_value').text(r);
        $.ajax({
          type: 'POST', url: `http://localhost:3010/org/getByAddresses`, data: { accountAddress: orgs }
        }).done(function (orgdata) {

          if ($("#orgTable tbody").length == 0) {
            $("#orgTable").append("<tbody id='tbodyid_matches'></tbody>");
          }
          $("#tbodyid_matches").empty();
          for (let i = 0; i < orgdata.length; i++) {

            // Append org to the table

            $("#orgTable tbody").append("<tr>" +
              "<td>" + orgdata[i].name + "</td>" +
              "<td>" + orgdata[i].address + "</td>" +
              "<td>" + orgdata[i].contactNo + "</td>" +
              "<td>" + orgdata[i].email + "</td>" +
              "<td><button type='button' id='donate_" + orgdata[i].accountAddress + "' class='btn btn-info mb-2'>Donate</button></td>" +
              "</tr>");

          }

          // $(".viewmatches-container").css("display", "block");
          $(".loader").css("display", "none");
          $("#viewMatchesForm").css("display", "block");
          // $("#viewMatchesForm").css("backdrop-filter", "blur(3px)");
          $("#maindiv").css("opacity", 0.2);
          console.log(orgdata);
          toastr.success("Matches recieved");

        })
      })
      .catch((error) => {
        $(".loader").css("display", "none");
        console.log("Error in smart contract call")
        console.log(error)
        toastr.error("Transaction not authorized for user!");
      })
  },

  handleDonate: async function (orgAddress) {
    if (orgAddress === '' || !orgAddress) {
      alert("Error : Organization does not exist!")
      return false
    }
    let _data = {
      donor_id: App.handler,
      org_id: orgAddress,
      timestamp: Date.now().toString(),
      status: 'DONATED'
    }

    var option = { from: App.handler }
    App.contracts.Angellocks.methods.donate(_data['org_id'], _data['donor_id'], _data['timestamp'])
      .send(option)
      .on('receipt', async (receipt) => {
        if (receipt.status) {

          console.log('Donate Transaction recorded on the blockchain!')

          // Insert record into mongodb
          let index = await App.contracts.Angellocks.methods.getDonationsCount().call()
          console.log(index)
          _data.donation_id = index - 1
          $.ajax({
            type: 'POST', url: `http://localhost:3010/donation/donate`, data: _data
          }).done((res) => {
            $(".loader").css("display", "none");
            $("#viewMatchesForm").css("display","none");
            $("#maindiv").css("opacity", 1);
            toastr.success("Donation Recorded !");
          })
        }
      })
      .on('error', (err) => {
        console.log(err)
        $(".loader").css("display", "none");
        $("#viewMatchesForm").css("opacity",1);
        toastr.error("Error ocurred in registration process !");
        toastr.error(err)
      })

  },

  handleViewStatus: function () {

    App.contracts.Angellocks.methods.view_donation_status(App.handler)
      .call()
      .then((results) => {

        let orgAddresses = results.addresses
        orgAddresses = orgAddresses.map((o) => o.toLowerCase())
        let statuses = results.statuses
        let donor_address = App.handler.toLowerCase()

        $.ajax({
          type: 'POST', url: `http://localhost:3010/org/getDonations`, data: { org: orgAddresses, donor: donor_address }
        }).done(function (orgdata) {

          if ($("#donTable tbody").length == 0) {
            $("#donTable").append("<tbody id='tbody_status'></tbody>");
          }
          $("#tbody_status").empty();
          for (let i = 0; i < orgAddresses.length; i++) {

            // Append org to the table
            // let _org = orgdata.find((e) => e.accountAddress == orgAddresses[i])
            let _org = orgdata[i]

            // let _status = statuses[i] == 1 ? "ACCEPTED" : (statuses[i] == 2 ? "DECLINED" : "DONATED")
            if (_org) {
              $("#donTable tbody").append("<tr>" +
                "<td>" + _org.name + "</td>" +
                "<td>" + _org.address + "</td>" +
                "<td>" + _org.contactNo + "</td>" +
                "<td>" + _org.email + "</td>" +
                "<td>" + new Date(_org.timestamp) + "</td>" +
                "<td>" + _org.status + "</td>" +
                "</tr>");
            }

          }

          $(".loader").css("display", "none");
          $("#viewDonationStatusForm").css('display','block');
          $("#maindiv").css("opacity", 0.2);
          toastr.success("Your donations recieved");

        })
      })
      .catch((error) => {
        $(".loader").css("display", "none");
        console.log("Error in smart contract call")
        console.log(error)
        toastr.error("Transaction not authorized for user!");
      })
  },

  handleViewDonations: function () {

    App.contracts.Angellocks.methods.view_donations(App.handler)
      .call()
      .then((results) => {

        let donation_ids = results

        $.ajax({
          type: 'POST', url: `http://localhost:3010/donation/getByIds`, data: { donation_id: donation_ids }
        }).done(function (donationdata) {


          if ($("#viewDonTable tbody").length == 0) {
            $("#viewDonTable").append("<tbody id='tbody_don'></tbody>");
          }
          $("#tbody_don").empty();
          for (let i = 0; i < donationdata.length; i++) {

            $("#viewDonTable tbody").append("<tr>" +
              "<td>" + donationdata[i].name + "</td>" +
              "<td>" + donationdata[i].email + "</td>" +
              "<td>" + donationdata[i].contactNo + "</td>" +
              "<td>" + donationdata[i].type + "</td>" +
              "<td>" + donationdata[i].length + "</td>" +
              "<td>" + donationdata[i].texture + "</td>" +
              "<td><button type='button' id='accept_" + donationdata[i].donation_id + "' class='btn btn-info mb-2'>Accept</button></td>" +
              "<td><button type='button' id='reject_" + donationdata[i].donation_id + "' class='btn btn-info mb-2'>Reject</button></td>" +
              "</tr>");

          }

          $(".loader").css("display", "none");
          $("#viewDonationsForm").css("display", "block");
          $("#maindiv").css("opacity", 0.2);

        })
      })
      .catch((error) => {
        $(".loader").css("display", "none");
        console.log("Error in smart contract call")
        console.log(error)
        toastr.error("Transaction not authorized for user!");
      })
  },

  handleDecision: async function (donation_id, decision) {
    if (donation_id === '' || !donation_id) {
      alert("Error : Donation does not exist!")
      return false
    }

    var option = { from: App.handler }
    donation_id = parseInt(donation_id)
    decision = parseInt(decision)
    App.contracts.Angellocks.methods.update_donation_status(donation_id, decision)
      .send(option)
      .on('receipt', async (receipt) => {
        if (receipt.status) {
          console.log('Donate status updated on the blockchain!')

          // Update donation status into mongodb
          let _data = { status: 1 ? "ACCEPTED" : "REJECTED" }
          console.log('Donate status updated on the blockchain to ' + _data.status + '!')
          $.ajax({
            type: 'PUT', url: `http://localhost:3010/donation/updateStatus/${donation_id}`, data: _data
          }).done((res) => {
            $(".loader").css("display", "none");
            $("#maindiv").css("opacity", 1);
            $("#viewDonationsForm").css("display","none");
            if (decision == 1)
              toastr.success("Donation Accepted !");
            else
              toastr.success("Donation Rejected !");
          })
        }
      })
      .on('error', (err) => {
        console.log(err)
        $(".loader").css("display", "none");
        toastr.error("Error ocurred in registration process");
        toastr.error(err)
      })

  },


  abi: [
    {
      "constant": false,
      "inputs": [
        {
          "name": "type",
          "type": "bool"
        },
        {
          "name": "gray",
          "type": "bool"
        },
        {
          "name": "colored",
          "type": "bool"
        },
        {
          "name": "length",
          "type": "uint256"
          // "type": "string"
        },
        {
          "name": "wavy",
          "type": "bool"
        },
        {
          "name": "curly",
          "type": "bool"
        },
        {
          "name": "straight",
          "type": "bool"
        }
      ],
      "name": "register",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "addres1",
          "type": "address"
        }
      ],
      "name": "match_org",
      "outputs": [
        {
          "name": "result",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "org_address",
          "type": "address",

        },
        {
          "name": "donor_address",
          "type": "address",

        },
        {
          "name": "timestamp",
          "type": "string",

        }
      ],
      "name": "donate",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [{
        "name": "donor_id",
        "type": "address"
      }],
      "name": "view_donation_status",
      "outputs": [
        {
          "name": "addresses",
          "type": "address[]"
        },
        {
          "name": "statuses",
          "type": "uint[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [{
        "name": "org_id",
        "type": "address"
      }],
      "name": "view_donations",
      "outputs": [
        {
          "name": "ids",
          "type": "uint[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
      ],
      "name": "getDonationsCount",
      "outputs": [
        {
          "name": "result",
          "type": "uint"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "donation_id",
          "type": "uint256"
        },
        {
          "name": "decision",
          "type": "uint256"
        }
      ],
      "name": "update_donation_status",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
  ]

}

$(function () {
  $(window).load(function () {
    App.init();
    toastr.options = {
      // toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-bottom-full-width",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
      // }
    };
  });
});

