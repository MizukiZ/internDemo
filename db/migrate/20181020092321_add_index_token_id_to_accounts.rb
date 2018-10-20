class AddIndexTokenIdToAccounts < ActiveRecord::Migration[5.2]
  def change
    add_index :accounts, [:token_id], :unique => true
  end
end
