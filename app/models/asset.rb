class Asset < ApplicationRecord
    validates :listed, presence: true
    validates :ticker, presence: true
    validates :currency, presence: true
    validates :volume, presence: true
    validates :cost, presence: true

    belongs_to :user
end
