// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

pragma experimental ABIEncoderV2;
contract selling{
    struct picture{
        string picture_nft;
        uint highestprice;
        uint startprice;
        address payable highest_bidder;
        uint picture_id;
        bool onsell;
        uint deadline;
    }
    uint public picture_num;
    mapping(uint=>address) public all_picture_owner;
    picture [] public all_picture;

    function createPicture(string memory _pictureNft) public returns(uint){
        uint id;
        picture memory anew=picture(_pictureNft,0,0,payable(msg.sender),0,false,0);
        all_picture.push(anew);
        id=all_picture.length-1;
        picture_num=all_picture.length;
        all_picture[id].picture_id=id;
        all_picture_owner[id]=msg.sender;
        return id;
    }

    function getPictureByAddress(string memory _pictureNft) private view returns (uint){
        for(uint i=0;i<all_picture.length;i++)
        {
            if(StringCompare(all_picture[i].picture_nft,_pictureNft))
            {
                return i;
            }
        }
    }
    function getPictureById(uint id)public view returns(picture memory){
        return all_picture[id];
    }

    function auction(uint id,uint _startprice,uint _deadline)public payable{
        picture storage devote=all_picture[id];
        require(msg.sender==all_picture_owner[devote.picture_id]);
        devote.onsell=true;
        devote.startprice=_startprice;
        devote.deadline=_deadline;
    }
    function bid(uint id,uint _price)public payable{
        picture storage devote=all_picture[id];
        devote.highestprice=_price;
        devote.highest_bidder=payable(msg.sender);
    }
    function auctionConfirm(uint _id,uint price)public payable returns(bool){
        
        picture storage devote=all_picture[_id];
        require(devote.highest_bidder==msg.sender);
        address payable preOwner=payable(all_picture_owner[_id]);
        preOwner.transfer(msg.value);
        all_picture_owner[_id]=msg.sender;
        devote.startprice=0;
        devote.onsell=false;
        devote.deadline=0;
        return true;
    }
    function cancel_auction(uint _id)public{
        picture storage devote=all_picture[_id];
        require(all_picture_owner[_id]==msg.sender);
        devote.deadline=0;
        devote.highest_bidder=payable(msg.sender);
        devote.highestprice=0;
        devote.onsell=false;
        devote.startprice=0;
    }
    function getBalance() public view returns (uint){
        return address(this).balance;
    }
    function StringCompare(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encode(a)) == keccak256(abi.encode(b));
    }
}