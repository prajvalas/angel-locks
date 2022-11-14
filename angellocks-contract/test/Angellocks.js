const Angellocks = artifacts.require('Angellocks.sol')
let sender = []
contract('Angellocks', () =>{

    it('Should register Donor', async () => {
        sender = await web3.eth.getAccounts();
        // console.log(sender)
        const Angellocksinstance = await Angellocks.deployed()
        let result = await Angellocksinstance.register(false,false,true,5,true,false,false)
        // console.log(result.receipt)
        // sender = result.receipt.from
        let getresult = await Angellocksinstance.getDonorCount()
        assert(result.receipt.status.toString() === "true")
        assert(getresult.toString() === "1")
    });

    it('Should register Organization', async () => {
        const Angellocksinstance = await Angellocks.deployed()
        let result = await Angellocksinstance.register(true,true,true,3,true,true,true)
        let getresult = await Angellocksinstance.getOrgCount()
        assert(result.receipt.status.toString() === "true")
        assert(getresult.toString() === "1")
    });

    it('Should view matches correctly', async () => {
        const Angellocksinstance = await Angellocks.deployed()
        let result = await Angellocksinstance.match_org(sender[0])
        assert(result.length > 0)
        assert(result[0].toString() === sender[0].toString())
    });

    it('Should donate correctly', async () => {
        const Angellocksinstance = await Angellocks.deployed()
        let result = await Angellocksinstance.donate(sender[0], sender[0], Date.now().toString())
        let getresult = await Angellocksinstance.getDonationsCount()
        assert(result.receipt.status.toString() === "true")
        assert(getresult.toString() === "1")
    });

    it('Should view current donation status correctly', async () => {
        const Angellocksinstance = await Angellocks.deployed()
        let result = await Angellocksinstance.view_donation_status(sender[0])
        assert(result["0"][0].toString() === sender[0].toString())
        assert(result["1"][0].toString() === "0")
    });

    it('Should be able to view donations correctly for organization', async () => {
        const Angellocksinstance = await Angellocks.deployed()
        let result = await Angellocksinstance.view_donations(sender[0])
        assert(result.length > 0)
        assert(result[0].toString() === "0")
    });

    it('Should be able to accept donations correctly', async () => {
        const Angellocksinstance = await Angellocks.deployed()
        let result = await Angellocksinstance.update_donation_status(0,1)
        assert(result.receipt.status.toString() === "true")
        
    });

    it('Should be able to decline donations correctly', async () => {
        const Angellocksinstance = await Angellocks.deployed()
        let result = await Angellocksinstance.update_donation_status(0,2)
        assert(result.receipt.status.toString() === "true")
        
    });
    
});