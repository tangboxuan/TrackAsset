require "httparty"
require "money"

class YfinanceService < ApplicationService

  BASE_URL = "https://finnhub.io/api/v1/quote?symbol="
  DEFAULT_PROXIES = {
    "http": nil,
    "https": nil
  }
  MYTOKEN = "&token=c3v554qad3icubp28kbg" # insecure but oh well

  def initialize(ticker_name, proxies=DEFAULT_PROXIES)
    @ticker_name = ticker_name
    @proxies = proxies
    @url = URI(BASE_URL + ticker_name + MYTOKEN)
    @price_data = HTTParty.get(url=@url, proxies=@proxies).parsed_response
  end

  def get_current_price()
    price = @price_data['c']

    return Money.from_amount(price, 'USD')
  end
end