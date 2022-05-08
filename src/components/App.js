import { use } from 'chai';
import React,{useState,useEffect}from 'react'
import Web3  from 'web3';
import Marketplace from '../abis/Marketplace.json'
function App() {
  const [marketplace,setMarketPlace] = useState({});
  const [products,setProducts] = useState([]);
  const [account,setAccount] = useState('');

  useEffect(()=>{
    loadBlockChain();
  },[]);


  const loadBlockChain = async ()=>{
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    const marketplace  = await window.web3.eth.Contract(Marketplace.abi,Marketplace.networks[5777].address);
    const account = await window.web3.eth.getAccounts();
    setAccount(account[0]);
    setMarketPlace(marketplace);
    const count = await marketplace.methods.productCount().call();
    let tempProducts = [];
    for(var i=1;i<=count;i++){
      const product = await marketplace.methods.products(i).call();
      tempProducts = [...tempProducts,product];
    } 
    setProducts(tempProducts);
  }

  const handleSubmit = (event) =>{
    event.preventDefault();
    const price = window.web3.utils.toWei(event.target.productPrice.value.toString(),'Ether')
    marketplace.methods.createProduct(event.target.productName.value,price).send({from : account});
  }

  const handleBuy = (event) =>{
    event.preventDefault();
    const price = event.target.value;
    const id = event.target.name;
    marketplace.methods.buyProduct(id).send({from : account,value:price});
  }
  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
      <a className="navbar-brand" href="#">MarketPlace</a> 
      <p className="navbar-brand" >{account}</p>
      </nav>
      <h2>Add Product</h2>
      <form onSubmit ={handleSubmit}>
          <div className="form-group mr-sm-2">
            <label htmlFor="productName">ProductName</label>
            <input type="text"  className="form-control" name="productName" aria-describedby="emailHelp" placeholder="Enter the name of the product"/>
          </div>
          <div className="form-group mr-sm-2">
            <label htmlFor="productPrice">Price</label>
            <input type="text" className="form-control" name="productPrice" placeholder="Enter price in Wei"/>
          </div>
          <button type="submit"  className="btn btn-primary">Submit</button>
      </form>

      <h2>MarketPlace</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Product id</th>
            <th scope="col">Product Name</th>
            <th scope="col">Product Owner</th>
            <th scope="col">Product Price</th>

          </tr>
        </thead>
        <tbody>        
          { products.map((product,key) =>{
              return(
                <tr key={key}>
                <th scope="row">{product.id.toString()}</th>
                <td>{product.name}</td>
                <td>{product.owner}</td>
                <td>{window.web3.utils.fromWei(product.price.toString(),'Ether')}Eth</td> 
                { 
                    !product.isPurchased && <td><button className='btn btn-dark' name={product.id} value={product.price} onClick={(e)=>handleBuy(e)}>Buy</button></td>
                }
                {product.isPurchased && <td>Owned</td>}
                </tr>
              )
             }
            )
          }
          {/* <h2>Your Products</h2>
          { products.map((product,key) =>{
              if(product.owner===account){
              return(
                <tr key={key}>
                <th scope="row">{product.id.toString()}</th>
                <td>{product.name}</td>
                <td>{product.owner}</td>
                <td>{window.web3.utils.fromWei(product.price.toString(),'Ether')}Eth</td> 
                <td><button className='btn btn-dark' onClick={handleBuy}>Sell</button></td>
                </tr>
              )}
             }
            )
          } */}
        </tbody>
      </table>
  </div>
  )
}

export default App

