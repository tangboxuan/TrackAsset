import React from "react";
import { Link } from "react-router-dom";

class Assets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: [],
      editing: 0,
      listed: true,
      market: "",
      ticker: "",
      currency: "",
      volume: 0.0,
      cost: -0.1,
      price: 0.0
    };

    this.onChange = this.onChange.bind(this);
    this.editAsset = this.editAsset.bind(this);
  }

  componentDidMount() {
    const url = "/api/v1/assets/index";
    fetch(url)
    .then(response => {
        if (response.ok) {
        return response.json();
        }
        throw new Error("Network response was not ok.");
    })
    .then(response => this.setState({ assets: response }))
    .catch(() => this.props.history.push("/"));
  }

  editingAsset(asset) {
    this.setState({
      editing: asset.id,
      listed: asset.listed,
      market: asset.market,
      ticker: asset.ticker,
      currency: asset.currency,
      volume: asset.volume,
      cost: asset.cost,
      price: asset.price
    })
  }

  editAsset(event) {
    event.preventDefault();
    const { 
        assets,
        editing,
        listed,
        market,
        ticker,
        currency,
        volume,
        cost,
        price
    } = this.state;
    const url = `/api/v1/assets/update/${editing}`;

    if (
        ticker.length == 0 
        || currency.length == 0 
        || volume <= 0 
        || cost < 0 
    ) return;

    const body = {
        listed,
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
        body: JSON.stringify(body)
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
      const url = `/api/v1/assets/destroy/${id}`;
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

      this.setState((prevState) => ({
        assets: prevState.assets.filter((asset) => asset.id !== id)
      }))

      .catch(error => console.log(error.message));
    }
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
          <td><input
              type="text"
              name="exchange"
              id="assetExchange"
              defaultValue={asset.market}
              required
              onChange={this.onChange}
          /></td>
          <td><input
              type="text"
              name="ticker"
              id="assetTicker"
              defaultValue={asset.ticker}
              required
              onChange={this.onChange}
          /></td>
          <td><input
              type="text"
              name="currency"
              id="assetCurrency"
              defaultValue={asset.currency}
              required
              onChange={this.onChange}
          /></td>
          <td><input
              type="number"
              name="volume"
              id="assetVolume"
              defaultValue={asset.volume}
              required
              onChange={this.onChange}
          /></td>
          <td><input
              type="number"
              name="cost"
              id="assetCost"
              defaultValue={asset.cost}
              required
              onChange={this.onChange}
          /></td>
          <td>
              <button type="submit">
              Confirm Edit
              </button>
          </td>   
          </tr>
      :
        <tr key={asset.id}>
            <td>{asset.market}</td>
            <td>{asset.ticker}</td>
            <td>{asset.currency}</td>
            <td>{asset.volume}</td>
            <td>{asset.cost}</td>
            <td><button onClick={() => this.deleteAsset(asset.ticker, asset.id)}>Delete</button></td>
            <td><button onClick={() => this.editingAsset(asset)}>Edit</button></td>
        </tr>
    ));

    return (
      <>
        <section className="jumbotron jumbotron-fluid text-center">
          <div className="container py-5">
            <h1 className="display-4">All assets</h1>
            <p className="lead text-muted">
              Filler lead text-muted
            </p>
          </div>
        </section>
        <div className="py-5">
          <main className="container">
            <div className="text-right mb-3">
              <Link to="/addasset" className="btn custom-button">
                Add New Asset
              </Link>
            </div>
            <form onSubmit={this.editAsset}>
              <table>
                <thead>
                  <tr>
                      <th>Market</th>
                      <th>Ticker</th>
                      <th>Currency</th>
                      <th>Volume</th>
                      <th>Cost</th>
                      <th>Actions</th>
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