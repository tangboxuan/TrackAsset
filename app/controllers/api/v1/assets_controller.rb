class Api::V1::AssetsController < ApplicationController
  before_action :require_login

  def index
    asset = Asset.where(user_id: params[:user_id]).order(created_at: :desc)
    render json: asset
  end

  def create
    asset = Asset.create!(asset_params)
    if asset
      render json: asset
    else
      render json: asset.errors
    end
  end

  def update
    if asset.update(asset_params)
      render json: asset
    else
      render json: asset.errors
    end
  end

  def destroy
    asset&.destroy
    render json: { message: 'Asset deleted!' }
  end

  def refresh
    @asset = Asset.where(user_id: params[:user_id]).each do |asset|
      # asset.market
      # asset.ticker
      # asset.currency
      asset.update(price: asset.price + 1)
    end
    render json: { mesage: 'Attempted to refresh!' }
  end

  private

  def require_login
    if current_user.nil?
      redirect_to :root
    end
  end

  def asset_params
    params.permit(:listed, :market, :ticker, :currency, :volume, :cost, :price, :user_id)
  end

  def asset
    @asset ||= Asset.find(params[:id])
  end
end
