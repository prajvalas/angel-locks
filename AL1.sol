//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <=0.6.0;

contract AL1 {

    struct Donor {   
        uint length;                  
        // bool permed;
        bool gray;
        bool colored;
        string texture;
    }

    struct Organization {
        address org_address;
        uint length;
        // bool permed;
        bool gray;
        bool colored;
        bool straight;
        bool curly;
        bool wavy;
    }
    
    uint private donors_length;
    uint private orgs_length;
    address payable owner;
    mapping(address => Donor) public donor_mapping;
    mapping(address => Organization) public org_mapping;
    Donor[] public donor_details;
    Organization[] public org_details;
    // address[] public result;

    // enum Phase {Init,Regs, Vote, Done}  
    // Phase public state = Phase.Done; 
    
    //modifiers
    // modifier validPhase(Phase reqPhase) 
    // { require(state == reqPhase); 
    //   _; 
    // } 

    constructor () public {
        owner = msg.sender;
        donors_length = 0;
        orgs_length = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
      _;
    }

    // modifier onlyDonor() {
        
    //     bool exists = false;
    //     for(uint i=0; i< donors_length; i++){
    //         if(donors[msg.sender].isRegistered){
    //             exists = true;
    //             break;
    //         }
    //     }
    //     require(exists);
    //   _;
    // }
    
    // modifier onlyOrganization() {
    //     bool exists = false;
    //     for(uint i=0; i< orgs_length; i++){
    //         if(orgs[msg.sender].isActive){
    //             exists = true;
    //             break;
    //         }
    //     }
    //     require(exists);
    //   _;
    // }

    
    
    //_type = 0 for user and 1 for org
    function register(bool _type, bool gray, bool colored,  uint length, bool wavy, bool curly, bool straight) public {
        if(_type){
            orgs_length++;
            Organization memory newOrg = Organization(msg.sender, length, gray, colored, straight, curly, wavy);
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
            Donor memory newDonor = Donor(length, gray, colored, texture);
            donor_mapping[msg.sender] = newDonor;
            donor_details.push(newDonor);
        }
        
    }

    function getDonorCount() view public returns (uint) { 
        return donors_length;
    } 
    function getOrgCount() view public returns (uint) { 
        return orgs_length;
    } 
    function closeContract() public onlyOwner{
        selfdestruct(owner);
    }

    function match_org(address donor_id)  public view returns (address [] memory){
        address[] memory result = new address[](orgs_length);
        // delete result;
        uint count = 0;
        for(uint i = 0; i < orgs_length; i++){
            if(org_details[i].length <= donor_mapping[donor_id].length
            && (org_details[i].colored == donor_mapping[donor_id].colored 
            /*|| org_details[i].permed == donor_mapping[donor_id].permed */
            || org_details[i].gray == donor_mapping[donor_id].gray)){
                if(org_details[i].straight && keccak256(abi.encodePacked('straight')) == keccak256(abi.encodePacked(donor_mapping[donor_id].texture))) {
                    result[count] = org_details[i].org_address;
                    count++;
                    // result.push(org_details[i].org_address);

                }
                else if(org_details[i].curly && keccak256(abi.encodePacked('curly')) == keccak256(abi.encodePacked(donor_mapping[donor_id].texture))) {
                    result[count] = org_details[i].org_address;
                    count++;
                    // result.push(org_details[i].org_address);

                }
                else if(org_details[i].wavy && keccak256(abi.encodePacked('wavy')) == keccak256(abi.encodePacked(donor_mapping[donor_id].texture))) {
                    result[count] = org_details[i].org_address;
                    count++;
                    // result.push(org_details[i].org_address);

                }
            }
            
        }
        return result;
    }

// && (org_details[i].straight == donor_mapping[donor_id].straight 
            // || org_details[i].curly == donor_mapping[donor_id].curly 
            // || org_details[i].wavy == donor_mapping[donor_id].wavy 
            // )){

    // function viewDonors() view public returns (Donor[] memory) { 
    //     Donor[] memory ret = new Donor[](donors_length);
    //     for (uint i = 0; i < donors_length; i++) {
    //         ret[i] = donors[i];
    //     }
    //     return ret; 
    // } 
    

    
    /*constructor (uint numProposals) public  {
        chairperson = msg.sender;
        voters[chairperson].weight = 2; // weight 2 for testing purposes
        //proposals.length = numProposals; -- before 0.6.0
        for (uint prop = 0; prop < numProposals; prop ++)
            proposals.push(Proposal(0));
        state = Phase.Regs;
    }
    
     function changeState(Phase x) onlyChair public {
        
        require (x > state );
       
        state = x;
     }
    
    function register(address voter) public validPhase(Phase.Regs) onlyChair {
       
        require (! voters[voter].voted);
        voters[voter].weight = 1;
        
    }

   
    function vote(uint toProposal) public validPhase(Phase.Vote)  {
      
        Voter memory sender = voters[msg.sender];
        
        require (!sender.voted); 
        require (toProposal < proposals.length); 
        
        sender.voted = true;
        sender.vote = toProposal;   
        proposals[toProposal].voteCount += sender.weight;
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
