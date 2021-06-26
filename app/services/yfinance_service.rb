require "httparty"

class YfinanceService < ApplicationService

  BASE_URL = "https://finance.yahoo.com/quote/"
  DEFAULT_PROXIES = {
    "http": nil,
    "https": nil
  }
  BID_KEY_PHRASE = "bid\":{\"raw\":"
  ASK_KEY_PHRASE = "ask\":{\"raw\":"
  ERROR_CODE = "HTTPServiceUnavailable"

  def initialize(ticker_name, proxies=DEFAULT_PROXIES)
    @ticker_name = ticker_name
    @proxies = proxies
    @url = URI(BASE_URL + ticker_name)
  end

  def get_bid_price
    html = HTTParty.get(url=@url, proxies=@proxies)

    return -1 if html.response.to_s.include?(ERROR_CODE)

    json_str = html.split('root.App.main =')[1].split('(this)')[0].split(';\n}')[0].strip()
    bid_price_start_index = json_str.index(BID_KEY_PHRASE) + BID_KEY_PHRASE.length
    bid_price_end_index = json_str[bid_price_start_index..-1].index(",") + bid_price_start_index - 1
    bid_price = json_str[bid_price_start_index..bid_price_end_index]

    if bid_price.nil?
      return -1
    end

    bid_price.to_f
  end

  def get_ask_price
    html = HTTParty.get(url=@url, proxies=@proxies)

    return -1 if html.response.to_s.include?(ERROR_CODE)

    json_str = html.split('root.App.main =')[1].split('(this)')[0].split(';\n}')[0].strip()
    ask_price_start_index = json_str.index(ASK_KEY_PHRASE) + ASK_KEY_PHRASE.length
    ask_price_end_index = json_str[ask_price_start_index..-1].index(",") + ask_price_start_index - 1
    ask_price = json_str[ask_price_start_index..ask_price_end_index]

    return ask_price.to_f
  end
end