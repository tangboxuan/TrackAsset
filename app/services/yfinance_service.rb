require "httparty"
require "money"

class YfinanceService < ApplicationService

  BASE_URL = "https://finance.yahoo.com/quote/"
  DEFAULT_PROXIES = {
    "http": nil,
    "https": nil
  }
  BID_KEY_PHRASE = "bid\":{\"raw\":"
  ASK_KEY_PHRASE = "ask\":{\"raw\":"
  CURRENCY_KEY_WORD = "\"currency\":"
  ERROR_CODE = "HTTPServiceUnavailable"

  def initialize(ticker_name, proxies=DEFAULT_PROXIES)
    @ticker_name = ticker_name
    @proxies = proxies
    @url = URI(BASE_URL + ticker_name)
    @html = HTTParty.get(url=@url, proxies=@proxies)
  end

  private def get_json_str
    @json_str ||= @html.split('root.App.main =')[1].split('(this)')[0].split(';\n}')[0].strip()
  end

  def get_bid_price
    return get_bid_or_ask(BID_KEY_PHRASE)
  end

  def get_ask_price
    return get_bid_or_ask(ASK_KEY_PHRASE)
  end

  private def get_bid_or_ask(key_phrase)
    return -1 if @html.response.to_s.include?(ERROR_CODE)

    get_json_str
    start_index = @json_str.index(key_phrase) + key_phrase.length
    end_index = @json_str[start_index..-1].index(",") + start_index - 1
    price = @json_str[start_index..end_index].to_f

    currency = get_currency

    return Money.from_amount(price, currency)
  end

  private def get_currency
    currency_start_index = @json_str.index(CURRENCY_KEY_WORD) + CURRENCY_KEY_WORD.length + 1
    currency_end_index = @json_str[currency_start_index..-1].index(",") + currency_start_index - 2
    return @json_str[currency_start_index..currency_end_index]
  end
end