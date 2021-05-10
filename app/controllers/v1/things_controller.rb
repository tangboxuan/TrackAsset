class V1::ThingsController < ApplicationController
    def index
        render json: { :things => [
            {
                :name => 'some-thing',
                :guid => '1234567890'
            }
        ] }.to_json
        end
    end
    