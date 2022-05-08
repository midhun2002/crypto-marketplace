pragma solidity ^0.5.0;

contract MarketPlace{
    uint public productCount;
    struct Product{
        uint id;
        uint price;
        address payable owner;
        string name;
        bool isPurchased;
    }
    mapping(uint => Product) public products;
    constructor() public {
        productCount = 0;
    }
    function createProduct(string memory _name,uint _price) public {
        productCount++;
        products[productCount] = Product(productCount,_price,msg.sender,_name,false);
    }
    function buyProduct(uint _id) payable public{
        Product memory product = products[_id];
        require(msg.sender!=product.owner,"You can't buy which u have already owned");
        require(msg.value>=product.price,"There isn't enough balance");
        require(product.isPurchased==false,"The product has already bought by someone");
        product.owner.transfer(msg.value);
        product.owner = msg.sender;
        product.isPurchased = true;
        products[_id] = product;
        return; 
    }
}