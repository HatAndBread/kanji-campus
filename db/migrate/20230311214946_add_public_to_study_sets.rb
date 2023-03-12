class AddPublicToStudySets < ActiveRecord::Migration[7.0]
  def change
    add_column :study_sets, :public, :boolean, null: false, default: false
  end
end
