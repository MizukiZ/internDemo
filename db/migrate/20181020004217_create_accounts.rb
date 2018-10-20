class CreateAccounts < ActiveRecord::Migration[5.2]
  def change
    create_table :accounts, id: :uuid do |t|
      t.string :token_id
      t.string :name
      t.string :email

      t.timestamps
    end
  end
end
