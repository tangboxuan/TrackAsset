require 'money'
require 'httparty'
require 'json'

class CurrencyExchangeService < ApplicationService
  BASE_URL = "https://v6.exchangerate-api.com/v6/7994619ba27a0037f5c150fb/latest/"

  def initialize(base_currency)
    @base_currency = base_currency
    url = BASE_URL + base_currency
    response = HTTParty.get(url).to_s
    @response_obj = JSON.parse(response)
  end

  def convert_to(amount, currency)
    # Amount defined in base_currency
    exchange_rate = @response_obj['conversion_rates'][currency]
    return (amount * exchange_rate).round(2)
  end
end
