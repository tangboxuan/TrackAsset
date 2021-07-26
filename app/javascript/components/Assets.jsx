import React from "react";
import { Link } from "react-router-dom";
import History from "../routes/History";
import Port from "../routes/Port";
import {Button} from 'react-bootstrap';

class Assets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: [],
      editing: 0,
      market: "",
      ticker: "",
      currency: "",
      volume: 0.0,
      cost: -0.1,
      price: -0.1,
    };

    this.onChange = this.onChange.bind(this);
    this.editAsset = this.editAsset.bind(this);
    this.refreshPrices = this.refreshPrices.bind(this);
  }

  componentDidMount() {
    const url = `${Port}/assets/index/${this.props.id}`;
    fetch(url)
    .then(response => {
        if (response.ok) {
        return response.json();
        }
        throw new Error("Network response was not ok.");
    })
    .then(response => this.setState({ assets: response }))
    .catch(() => History.push("/"));
  }

  editingAsset(asset) {
    this.setState({
      editing: asset.id,
      market: asset.market,
      ticker: asset.ticker,
      currency: asset.currency,
      volume: asset.volume,
      cost: asset.cost,
      price: asset.price,
    })
  }

  editAsset(event) {
    event.preventDefault();
    const { 
        assets,
        editing,
        market,
        ticker,
        currency,
        volume,
        cost,
        price,
    } = this.state;
    const url = `${Port}/assets/update/${editing}`;

    if (
        ticker.length == 0 
        || currency.length == 0 
        || volume <= 0 
        || cost < 0 
        || price < 0
    ) return;

    const asset = {
        market,
        ticker,
        currency,
        volume,
        cost,
        price
    };

    const token = document.querySelector('meta[name="csrf-token"]').content;

    fetch(url, {
        method: "PUT",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(asset)
    })

    .then(response => {
    if (response.ok) {
        return response.json();
    }
    throw new Error("Network response was not ok.");
    })

    .then(() => location.reload())

    .catch(error => console.log(error.message));
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  deleteAsset(name, id) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      const url = `${Port}/assets/destroy/${id}`;
      const token = document.querySelector('meta[name="csrf-token"]').content;

      fetch(url, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        }
      })

      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })

      .then(this.setState((prevState) => ({
        assets: prevState.assets.filter((asset) => asset.id !== id)
      })))

      .catch(error => console.log(error.message));
    }
  }

  refreshPrices() {
    const url = `${Port}/assets/refresh/${this.props.id}`;
    const token = document.querySelector('meta[name="csrf-token"]').content;

    fetch(url, {
      method: "GET",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      }
    })

    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })

    .then(() => location.reload())

    .catch(error => console.log(error.message));
  }

  render() {
    const { 
      assets, 
      editing,
      listed,
      market,
      ticker,
      currency,
      volume,
      cost,
      price } = this.state;

    const noAssets = <tr><td colSpan="6">No listed assets added yet</td></tr>
    const allAssets = assets.map((asset, index) => (
      asset.id == editing ? 
        <tr key={asset.id}>
          <td>
            {asset.listed?"Yes":"No"}
          </td>
          <td><input
              type="text"
              size="4"
              name="market"
              id="assetMarket"
              defaultValue={asset.market}
              class="form-control"
              required
              onChange={this.onChange}
          /></td>
          <td><input
              type="text"
              size="4"
              name="ticker"
              id="assetTicker"
              class="form-control"
              defaultValue={asset.ticker}
              required
              onChange={this.onChange}
          /></td>
          <td><input
              type="text"
              size="4"
              name="currency"
              id="assetCurrency"
              class="form-control"
              defaultValue={asset.currency}
              required
              onChange={this.onChange}
          /></td>
          <td><input
              type="number"
              name="volume"
              id="assetVolume"
              class="form-control"
              defaultValue={asset.volume}
              required
              onChange={this.onChange}
          /></td>
          <td><input
              type="number"
              name="cost"
              id="assetCost"
              class="form-control"
              defaultValue={asset.cost}
              required
              onChange={this.onChange}
          /></td>
          <td><input
              type="number"
              name="price"
              id="assetPrice"
              class="form-control"
              defaultValue={asset.price}
              required
              onChange={this.onChange}
          /></td>
          <td>
            {asset.updated_at}
          </td>
          <td colSpan="2">
              <button class="btn btn-primary" type="submit">
                Confirm Edit
              </button>
          </td>   
          </tr>
      :
        <tr key={asset.id}>
            <td>{asset.listed?"Yes":"No"}</td>
            <td>{asset.market}</td>
            <td>{asset.ticker}</td>
            <td>{asset.currency}</td>
            <td>{asset.volume}</td>
            <td>{asset.cost}</td>
            <td>{asset.price}</td>
            <td>{asset.updated_at}</td>
            <td><Button variant='secondary' onClick={() => this.editingAsset(asset)}>Edit</Button></td>
            <td><Button variant='danger' onClick={() => this.deleteAsset(asset.ticker, asset.id)}>Delete</Button></td>
        </tr>
    ));

    return (
      <>
        <section className="jumbotron jumbotron-fluid text-center">
          <div className="container py-5">
            <h1 className="display-4">All assets</h1>
          </div>
        </section>
        <div className="py-5">
          <main className="container">
            <div className="text-right mb-3">
              <Link to="/addasset" className="btn custom-button mt-3">
                Add New Asset
              </Link> 
              &ensp;
              <button onClick={this.refreshPrices} className="btn custom-button mt-3">
                Refresh Prices
              </button>
            </div>
            <form onSubmit={this.editAsset}>
              <table class='table table-striped'>
                <thead>
                  <tr>
                      <th scope='col'>Listed</th>
                      <th scope='col'>Market</th>
                      <th scope='col'>Ticker</th>
                      <th scope='col'>Currency</th>
                      <th scope='col'>Volume</th>
                      <th scope='col'>Cost</th>
                      <th scope='col'>Price</th>
                      <th scope='col'>Updated</th>
                      <th scope='col' colSpan="2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.length == 0 ? noAssets : allAssets}
                </tbody>
              </table>
            </form>
          </main>
        </div>
      </>
    );
  }

}
export default Assets;