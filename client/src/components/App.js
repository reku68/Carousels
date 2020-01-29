import React, { Component } from 'react';
import Carousel from './Carousel';
import axios from 'axios';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      productId: '',
      categoryId: '1', // If category id = 0; return all categories
      counter: 0,
      productsAll: '',
      productsFive: '',
      productsNumber: ''
    };
    this.getProducts = this.getProducts.bind(this);
    this.getFive = this.getFive.bind(this);
    this.nextFive = this.nextFive.bind(this);
    this.lastFive = this.lastFive.bind(this);
    this.goToProduct = this.goToProduct.bind(this);
    this.goToRating = this.goToRating.bind(this);
  }

  componentDidMount() {
    this.getProducts();
  }

  goToProduct() {
    console.log('Will send customer to product page', event.target.id);
  }

  goToRating() {
    console.log('Will send customer to rating page', event.target.name);
  }
  
  // Retrieves 5 products from productsAll (results of getProducts db query) and assigns them to productsFive
  getFive() {
    let getFive = this.state.productsAll.slice(this.state.counter, this.state.counter+5);
    this.setState({productsFive: getFive});
    console.log(this.state.productsFive);
  }
  
  // Increments state.counter and loads next 5 items when right button clicked
  nextFive() {
    let nextCounter = 0;
    if (!(this.state.counter+5 >= this.state.productsNumber)) {
      nextCounter = this.state.counter+5;
    }
    this.setState({counter: nextCounter}, () => {this.getFive()});
  }

   // Decrements state.counter and loads last 5 items when left button clicked
  lastFive() {
    let lastCounter = 0;
    if (this.state.counter-5 < 0) {
      if (this.state.productsNumber%5 === 0) {
        lastCounter = this.state.productsNumber - 5;
      } else {
        lastCounter = this.state.productsNumber - (this.state.productsNumber%5);
      }
    } else {
      lastCounter = this.state.counter-5;
    }  
    this.setState({counter: lastCounter}, () => {this.getFive()});
  }

  // Gets all products in db that match categoryId (0 being all) and assigns them to productsAll
  getProducts() {
    axios.get(`/getProducts/${this.state.categoryId}`)
    .then((response) => {
      this.setState({productsAll: response.data});
    })
    .then(() => {
      this.state.productsNumber = this.state.productsAll.length;
      this.getFive();
    })
    .catch(function(error) {
      console.log(error);
    });
  }
  
  render() {
    return (
      <div>
        <Carousel 
          productsFive={this.state.productsFive} 
          nextFive={this.nextFive} 
          lastFive={this.lastFive} 
          counter={this.state.counter}
          productsNumber={this.state.productsNumber}
          goToProduct={this.goToProduct}
          goToRating={this.goToRating}
        />
      </div>
    );
  }
}
