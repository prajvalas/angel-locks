//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.0 <0.9.0;

contract Angellocks {

    struct Donor {   
        uint length;
        bool gray;
        bool colored;
        string texture;
        bool isActive;
    }

    struct Organization {
        address org_address;
        uint length;
        bool gray;
        bool colored;
        bool straight;
        bool curly;
        bool wavy;
        bool isActive;
    }
    
    struct Donation{
        uint id;
        address org_address;
        address donor_address;
        uint status;
        string date;
    }

    // address public sender = msg.sender;
    uint private donors_length;
    uint private orgs_length;
    uint private donations_length;
    address payable owner;
    mapping(address => Donor) public donor_mapping;
    mapping(address => Organization) public org_mapping;
    Donor[] public donor_details;
    Organization[] public org_details;
    Donation[] public donation_details;


    constructor () public {
        owner = msg.sender;
        donors_length = 0;
        orgs_length = 0;
        donations_length = 0;
    }

    //modifiers
    modifier onlyOwner() {
        require(msg.sender == owner);
      _;
    }

    modifier onlyDonor(address sender) {
        require(donor_mapping[sender].isActive);
      _;
    }
    
    modifier onlyOrganization(address sender) {
        require(org_mapping[sender].isActive);
      _;
    }

    modifier validateStatus(uint status) { 
        require(status == 0); 
      _; 
    } 
    
    //Person registering can be -----> 0 - user, 1 - org
    function register(bool _type, bool gray, bool colored,  uint length, bool wavy, bool curly, bool straight) public {
        if(_type){
            orgs_length++;
            Organization memory newOrg = Organization(msg.sender, length, gray, colored, straight, curly, wavy, true);
            org_mapping[msg.sender] = newOrg;
            org_details.push(newOrg);
        }
        else{
            string memory texture = "wavy";
            donors_length++;
            if(curly){
                texture = "curly";
            }
            if(straight){
                texture = "straight";
            }
            Donor memory newDonor = Donor(length, gray, colored, texture, true);
            donor_mapping[msg.sender] = newDonor;
            donor_details.push(newDonor);
        }
        
    }

    function match_org(address donor_id) public onlyDonor(donor_id) view returns (address [] memory){
        address[] memory result = new address[](orgs_length);
        uint count = 0;
        for(uint i = 0; i < orgs_length; i++){
            if(org_details[i].length <= donor_mapping[donor_id].length
            && (org_details[i].colored == donor_mapping[donor_id].colored 
            || org_details[i].gray == donor_mapping[donor_id].gray)){
                if(org_details[i].straight && keccak256(abi.encodePacked('straight')) == keccak256(abi.encodePacked(donor_mapping[donor_id].texture))) {
                    result[count] = org_details[i].org_address;
                    count++;

                }
                else if(org_details[i].curly && keccak256(abi.encodePacked('curly')) == keccak256(abi.encodePacked(donor_mapping[donor_id].texture))) {
                    result[count] = org_details[i].org_address;
                    count++;

                }
                else if(org_details[i].wavy && keccak256(abi.encodePacked('wavy')) == keccak256(abi.encodePacked(donor_mapping[donor_id].texture))) {
                    result[count] = org_details[i].org_address;
                    count++;

                }
            }
            
        }
        return result;
    }

    function donate(address org_address, address donor_address, string memory date) public onlyDonor(donor_address) {
        Donation memory new_donation = Donation(donations_length, org_address, donor_address, 0, date);
        donation_details.push(new_donation);
        donations_length++;

    } 

    //Donations statuses are --->  0 - Donated, 1 - Accepted, 2 - Rejected
    function view_donation_status(address donor_id) public onlyDonor(donor_id) view returns(address [] memory, uint [] memory) {
        address [] memory addresses = new address[](donations_length);
        uint [] memory statuses = new uint[](donations_length);
        uint count = 0;
        for(uint i=0; i<donations_length; i++){
            if(donation_details[i].donor_address == donor_id){
                addresses[count] = donation_details[i].org_address;
                statuses[count] = donation_details[i].status;
                count++;
            }
        }
        return (addresses, statuses);
    }

    function view_donations(address org_id) public onlyOrganization(org_id) view returns(uint [] memory){
        uint [] memory ids = new uint[](donations_length);
        uint count = 0;
        for(uint i=0; i<donations_length; i++){
            if(donation_details[i].org_address == org_id){
                ids[count] = donation_details[i].id;
                count++;
            }
        }
        return (ids);
    }

    function update_donation_status(uint id, uint status) public {
        donation_details[id].status = status;
    }

    function getDonorCount() view public returns (uint) { 
        return donors_length;
    } 
    function getOrgCount() view public returns (uint) { 
        return orgs_length;
    } 
    function getDonationsCount() view public returns (uint) { 
        return donations_length;
    } 
    function closeContract() public onlyOwner{
        selfdestruct(owner);
    }
    
    /*constructor (uint numProposals) public  {
        chairperson = msg.sender;
        voters[chairperson].weight = 2; // weight 2 for testing purposes
        //proposals.length = numProposals; -- before 0.6.0
        for (uint prop = 0; prop < numProposals; prop ++)
            proposals.push(Proposal(0));
        state = Phase.Regs;
    }
    

    function reqWinner() public validPhase(Phase.Done) view returns (uint winningProposal) {
       
        uint winningVoteCount = 0;
        for (uint prop = 0; prop < proposals.length; prop++) 
            if (proposals[prop].voteCount > winningVoteCount) {
                winningVoteCount = proposals[prop].voteCount;
                winningProposal = prop;
            }
       assert(winningVoteCount>=3);
    }*/
}
