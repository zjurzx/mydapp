import selling from "./contracts/selling.json";
import Web3 from 'web3';

let web3=new Web3();
if (window.ethereum) {
    web3 = new Web3(window.ethereum)
} else if (window.web3) {
    web3 = new Web3(web3.currentProvider)
} else {
    alert('你需要先安装MetaMask')
}
window.ethereum.enable();

const contract = new web3.eth.Contract(
    selling.abi,
    "0xa6e257E35c88285DF74F90aa23edAa72ca9c5D9b",
    {
        gas: 1000000
    }
);

// function getAccount(){
//     let accounts = web3.eth.getAccounts();
//     return accounts[0];
// }

let getAccount = async() => {
    let accounts = await web3.eth.getAccounts();
    console.log(accounts[0])
    let account = accounts[0]
    console.log(account)
    return account;
}

async function getThePictureOwner(id){
    return await contract.methods.all_picture_owner(id).call();
}
async function createPicture(nft){
    const account= await getAccount();
    const id=await contract.methods.createPicture(nft).send({
        from:account,
        gas:1000000
    })
    return id;
}

async function getTheAllPictureLength(){
    return await contract.methods.picture_num().call()
}

async function getThePictureById(pictureId){
    let accounts = await web3.eth.getAccounts();
    let picture = await contract.methods.all_picture(pictureId).call();
    picture.highestprice = web3.utils.fromWei(picture.highestprice);
    picture.startPrice=web3.utils.fromWei(picture.startprice);
    return picture;
}

async function getThePictureIdByNfT(nft){
    let id=await contract.methods.getPictureByAddress(nft).call();
    return id;
}

async function getThePictureBelongMe(){
    let account =await getAccount();
    console.log(account)
    let length= await getTheAllPictureLength();
    let pictures=[];
    for(let i=1;i<length;i++)
    {
        let picture = {};
        picture = await getThePictureById(i);
        let thePictureOwner = await contract.methods.all_picture_owner(i).call();
        if(thePictureOwner===account)
        {
            pictures.push(picture);
        }
    }
    return pictures;
}
async function getThePictureMyAuction(){
    let pictures=[];
    pictures=await getThePictureBelongMe();
    let picture_my_auction=[];
    for(let i=0;i<pictures.length;i++)
    {
        if(pictures[i]['onsell']===true)
        {
            picture_my_auction.push(pictures[i]);
        }
    }
    return picture_my_auction;
}
async function creataAuction(nft,startPrice,deadline){
    const account = await getAccount();
    const start=web3.utils.toWei(startPrice.toString(10),'ether')
    console.log("start是啥啊")
    console.log(typeof(nft))
    console.log(typeof(start));
    console.log(typeof(deadline));
    return await contract.methods.auction(parseInt(nft),start,deadline).send({
        from:account,
        gas:1000000,
    })
}

async function cancelAuction(nft){
    const account =await getAccount();
    await contract.methods.cancel_auction(nft).send({
        from:account,
        gas:1000000
    });

}

async function getAllPicture(){
    const length= await getTheAllPictureLength();
    let pictures=[]
    for(let i=1;i<length;i++){
        let picture={}
        picture=await getThePictureById(i);
        console.log(picture)
        pictures.push(picture);
        console.log(999);
    }
    return pictures;
}

async function getAllAuctingPicture(){
    let pictures=[];
    let picture_all=await getAllPicture();
    for(let i=0;i<picture_all.length;i++){
        if(picture_all[i]['onsell']===true)
        pictures.push(picture_all[i]);
    }
    return pictures;
}

async function bid(id,price){
    const account = await getAccount();
    const Price=web3.utils.toWei(price.toString(10),'ether')
    await contract.methods.bid(id,Price).send({
        from:account,
        gas:1000000
    })
}
async function auctionConfirm(nft,highestprice){
    const account = await getAccount();
    const Price=web3.utils.toWei(highestprice.toString(10),'ether')
    const whether=await contract.methods.auctionConfirm(nft,Price).send({
        from:account,
        gas:1000000,
        value:Price
    })
    return whether;
}
function getLocalTime(nS) {     
    return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');     
 }

async function getBalance(){
    let balance = await contract.methods.getBalance().call();
    console.log(balance);
}

export {
    getThePictureOwner,
    getAccount,
    getAllAuctingPicture,
    getAllPicture,
    getBalance,
    getLocalTime,
    getTheAllPictureLength,
    getThePictureBelongMe,
    getThePictureById,
    getThePictureIdByNfT,
    getThePictureMyAuction,
    cancelAuction,
    creataAuction,
    bid,
    auctionConfirm,
    createPicture
}
export {
    web3,
    contract
}