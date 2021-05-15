class Api::V1::AssetsController < ApplicationController
  def index
    asset = Asset.all.order(created_at: :desc)
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

  private

  def asset_params
    params.permit(:listed, :market, :ticker, :currency, :volume, :cost, :price)
  end

  def asset
    @asset ||= Asset.find(params[:id])
  end
end
