import React from "react";
import { Link } from "react-router-dom";

class AddAsset extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        listed: true,
        market: "",
        ticker: "",
        currency: "",
        volume: 0.0,
        cost: -0.1,
        price: 0.0
      };
  
      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.stripHtmlEntities = this.stripHtmlEntities.bind(this);
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    
    onSubmit(event) {
        event.preventDefault();
        const url = "/api/v1/assets/create";
        const { 
            listed,
            market,
            ticker,
            currency,
            volume,
            cost,
            price
        } = this.state;

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
            method: "POST",
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

        .then(this.props.history.push(`/assets`))

        .catch(error => console.log(error.message));
    }

    stripHtmlEntities(str) {
        return String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    render() {
        return (
          <div className="container mt-5">
            <div className="row">
              <div className="col-sm-12 col-lg-6 offset-lg-3">
                <h1 className="font-weight-normal mb-5">
                  Add a listed asset.
                </h1>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label htmlFor="assetExchange">Stock Exchange</label>
                    <input
                      type="text"
                      name="exchange"
                      id="assetExchange"
                      className="form-control"
                      required
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="assetTicker">Ticker</label>
                    <input
                      type="text"
                      name="ticker"
                      id="assetTicker"
                      className="form-control"
                      required
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="assetCurrency">Currency</label>
                    <input
                      type="text"
                      name="currency"
                      id="assetCurrency"
                      className="form-control"
                      required
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="assetVolume">Volume</label>
                    <input
                      type="number"
                      name="volume"
                      id="assetVolume"
                      className="form-control"
                      required
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="assetCost">Cost</label>
                    <input
                      type="number"
                      name="cost"
                      id="assetCost"
                      className="form-control"
                      required
                      onChange={this.onChange}
                    />
                  </div>

                  <button type="submit" className="btn custom-button mt-3">
                    Add Asset
                  </button>
                  <Link to="/assets" className="btn btn-link mt-3">
                    Back to assets
                  </Link>
                </form>
              </div>
            </div>
          </div>
        );
      }
    
}

  
  export default AddAsset;