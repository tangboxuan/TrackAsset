class CreateAssets < ActiveRecord::Migration[6.1]
  def change
    create_table :assets do |t|
      t.boolean :listed, null: false
      t.string :market
      t.string :ticker, null: false
      t.string :currency, null: false
      t.float :volume, null: false
      t.float :cost, null: false
      t.float :price

      t.timestamps
    end
  end
end
